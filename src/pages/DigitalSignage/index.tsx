import ComingSoon from "../../components/shared/ComingSoon";

// The display, content and schedule components in ./components are ready to
// wire up once the API has signage endpoints.
function SignagePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-sans font-bold text-foreground">Digital Signage</h1>
        <p className="text-sm text-muted-foreground font-serif">
          Manage displays and content across your cinema
        </p>
      </div>
      <ComingSoon
        title="Digital signage"
        description="Managing lobby displays, content and schedules needs signage support in the API."
      />
    </div>
  );
}

export default SignagePage;
