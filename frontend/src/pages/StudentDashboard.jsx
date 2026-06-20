import DashboardLayout from "../components/DashboardLayout";

function StudentDashboard() {
  return (
    <DashboardLayout>
      <h1>Student Dashboard</h1>

      <div className="card">
        <h3>Student Access</h3>
        <p>
          Students can view their profile and personal information.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default StudentDashboard;
