import { useEffect } from "react";
import { router } from "expo-router";

export default function DoctorIndex() {
  useEffect(() => {
    // Redirect to the doctor dashboard
    router.replace("/doctor/sidenav/doctor-dashboard");
  }, []);

  return null;
}
