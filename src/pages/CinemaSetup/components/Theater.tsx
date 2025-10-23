/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import Button from "../../../components/shared/Button";
import { Tag } from "antd";
import { Edit, Trash2 } from "lucide-react";
import { deleteCinema, getAllCinemas } from "../../../store/slices/cinema";
import { useState } from "react";
import { useAppDispatch } from "../../../store/hook";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { toast } from "react-toastify";
import TheaterForm from "./AddTheaterForm";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";

const Theater = ({ cinemas, loading }: any) => {
  const [selectedCinema, setSelectedCinema] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (!selectedCinema) return;

    try {
      const response = await dispatch(
        deleteCinema(selectedCinema?.cinema_id)
      ).unwrap();
      if (response.code === 200) {
        await dispatch(getAllCinemas());
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          cinemas?.length > 0 &&
          cinemas?.map((theater: any) => (
            <Card
              key={theater?.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-sans">{theater?.name}</CardTitle>
                  <Tag
                    color={theater?.status === "Active" ? "green" : "orange"}
                  >
                    {theater?.status}
                  </Tag>
                </div>
                <CardDescription className="font-serif">
                  <p>{theater?.location}</p>
                  {theater?.screens?.length} screen • {theater?.totalSeats}{" "}
                  seats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {theater?.features?.map((feature: any) => (
                      <Tag key={feature} className="text-xs">
                        {feature}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      title="Edit"
                      icon={<Edit className="w-3 h-3" />}
                      className="flex-1 gap-2 rounded-md"
                      onClick={() => {
                        setSelectedCinema(theater);
                        setShowEditModal(true);
                      }}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      className="gap-2 rounded-md"
                      icon={<Trash2 className="w-3 h-3" />}
                      onClick={() => {
                        setSelectedCinema(theater);
                        setShowDeleteModal(true);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        item={selectedCinema?.name}
      />

      {/* Edit Modal */}
      <DisplayModal
        open={showEditModal}
        title={`Edit ${selectedCinema?.name}`}
        onClose={() => setShowEditModal(false)}
      >
        <TheaterForm
          onCancel={() => setShowEditModal(false)}
          editMode
          cinemaData={selectedCinema}
        />
      </DisplayModal>
    </>
  );
};

export default Theater;
