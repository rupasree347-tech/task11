import DashboardLayout from "../components/DashboardLayout";

function InstructorDashboard() {
  return (
    <DashboardLayout>
      <h1>Instructor Dashboard</h1>

      <div className="card">
        <h3>Instructor Access</h3>
        <p>
          Instructors can manage and view student records.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default InstructorDashboard;
