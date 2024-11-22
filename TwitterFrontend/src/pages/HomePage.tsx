import LeftSidebar from "../components/LeftSidebar/LeftSidebar";
import MiddleContent from "../components/MiddleContent/MiddleContent";
import RightSidebar from "../components/RightSidebar/RightSidebar";

const HomePage = () => {
  return (
    <div className="flex">
      <LeftSidebar />
      <MiddleContent />
      <RightSidebar /> 
    </div>

  );
};

export default HomePage;
