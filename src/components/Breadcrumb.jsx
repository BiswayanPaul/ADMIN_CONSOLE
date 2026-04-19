import { useLocation, useNavigate } from "react-router-dom";
import { getPathArray } from "../utils/pathUtils";

function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathArray = getPathArray(location.pathname);
  // ✅ Case 1: root path "/"
  if (pathArray.length === 0) {
    return (
      <div className="mb-4 text-sm">
        <span className="text-gray-700">/</span>
      </div>
    );
  }

  // ✅ Remove first "root" to avoid duplication
  const cleanPath = pathArray[0] === "root" ? pathArray.slice(1) : pathArray;

  return (
    <div className="flex items-center gap-2 text-sm mb-4">
      {/* Root */}
      <span
        onClick={() => navigate("/root")}
        className="cursor-pointer text-blue-600"
      >
        Root
      </span>

      {cleanPath.map((segment, index) => {
        const route = "/root/" + cleanPath.slice(0, index + 1).join("/");

        return (
          <div key={index} className="flex items-center gap-2">
            <span>{">"}</span>

            <span
              onClick={() => navigate(route)}
              className="cursor-pointer text-blue-600 capitalize"
            >
              {segment}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default Breadcrumb;
