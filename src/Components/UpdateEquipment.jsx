import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { BACKEND_URL } from "../shared/constants/variables/metadata";

const UpdateEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    image: "",
    itemName: "",
    categoryName: "",
    description: "",
    price: "",
    rating: "",
    customization: "",
    processingTime: "",
    stockStatus: "",
    userEmail: "",
    userName: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/data/${id}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        console.error("Error fetching equipment data:", err);
        setError(err.message);
      }
    };
    fetchEquipmentData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/data/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update equipment");
      await response.json();
      setSuccessMessage("Equipment updated successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Error updating equipment:", err);
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto my-6 pt-16">
      <h1 className="text-3xl text-cyan-500 font-bold mb-6">Update Equipment</h1>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleUpdate} className="p-6 shadow-md rounded bg-white space-y-4">
        {Object.keys(formData).map(
          (field) =>
            field !== "_id" && (
              <div key={field} className="flex flex-col">
                <label className="mb-2 font-semibold capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={["price", "rating", "stockStatus", "processingTime"].includes(field) ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  readOnly={["userEmail", "userName"].includes(field)}
                  className={`w-full p-2 border rounded ${
                    ["userEmail", "userName"].includes(field)
                      ? "bg-gray-100 text-gray-600"
                      : "bg-white"
                  }`}
                  placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                />
              </div>
            )
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Equipment
        </button>
      </form>
    </div>
  );
};

export default UpdateEquipment;
