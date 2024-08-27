import useFetchData from "../../hooks/useFetchData.js";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import DoctorCard from "./../../components/Doctors/DoctorCard.jsx";

const MyBookings = () => {
  const {
    data: appointments,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/users/appointments/my-appointments`);

  return (
    <div>
      {loading && !error && <Loading />}
      {error && !loading && <Error errorMessage={error} />}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {appointments.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}

      <div className="mt-10">
        {!loading && !error && appointments.length === 0 && (
          <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor">
            You did not book any doctor yet! 😒
          </h2>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
