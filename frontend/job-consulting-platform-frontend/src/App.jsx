import Availability from "./Availability";
import Booking from "./Booking";
import SystemStatus from "./SystemStatus";
import ConsultantApproval from "./ConsultantApproval";
import PolicyManager from "./PolicyManager";

function App() {
  return (
    <div>
      <h1>Consultant Dashboard</h1>

      <SystemStatus />

      <hr />

      <ConsultantApproval />

      <hr />

      <PolicyManager />

      <hr />

      <Availability />

      <hr />

      <Booking />
    </div>
  );
}

export default App;
