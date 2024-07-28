import React, { useEffect, useState } from "react";
import { db } from "../firebase/Config";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const ResultList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    studentId: "",
    marks: {},
    class: "",
    obtainedMarks: 0,
    totalMarks: 0,
    percentage: 0,
  });

  const [searchStudentId, setSearchStudentId] = useState("");
  const [searchClass, setSearchClass] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "results"), (snapshot) => {
      const resultsWithPercentage = snapshot.docs.map((doc) => {
        const data = doc.data();
        const obtainedMarks = Object.values(data.marks).reduce(
          (acc, mark) => acc + Number(mark),
          0
        );
        const totalMarks = data.totalMarks;
        const percentage = totalMarks ? (obtainedMarks / totalMarks) * 100 : 0;
        return { id: doc.id, ...data, obtainedMarks, percentage };
      });
      setResults(resultsWithPercentage);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "results", id));
  };

  const handleEdit = (result) => {
    setEditingId(result.id);
    setEditData(result);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const totalMarks = Object.values(editData.marks).reduce(
      (acc, mark) => acc + Number(mark),
      0
    );
    const percentage = editData.totalMarks
      ? (totalMarks / editData.totalMarks) * 100
      : 0;
    await updateDoc(doc(db, "results", editingId), {
      ...editData,
      obtainedMarks: totalMarks,
      percentage,
    });
    setEditingId(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredResults = results.filter(
    (result) =>
      result.studentId.toLowerCase().includes(searchStudentId.toLowerCase()) &&
      result.class.toLowerCase().includes(searchClass.toLowerCase())
  );

  const groupedResults = filteredResults.reduce((acc, result) => {
    const className = result.class;
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(result);
    return acc;
  }, {});

  const renderSkeletonLoader = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-300 h-8 w-full mb-2 rounded"
        ></div>
      ));
  };

  const getGrade = (percentage) => {
    if (percentage >= 80) return "A+";
    if (percentage >= 70) return "A";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "Fail";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <style>
        {`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
          .page-break {
            page-break-after: always;
          }
          .print-card-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .print-card {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}
      </style>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Result List</h1>
        <div className="mb-6 flex space-x-4 print-hide">
          <input
            type="text"
            placeholder="Search by Student ID"
            value={searchStudentId}
            onChange={(e) => setSearchStudentId(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Search by Class"
            value={searchClass}
            onChange={(e) => setSearchClass(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full max-w-xs"
          />
        </div>
        <button
          onClick={handlePrint}
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded print-hide"
        >
          Print
        </button>
        {loading ? (
          renderSkeletonLoader()
        ) : (
          Object.keys(groupedResults).map((className) => (
            <div key={className} className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Class: {className}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print-card-container">
                {groupedResults[className].map((result, index) => (
                  <div
                    key={result.id}
                    className={`bg-white p-6 rounded-lg shadow-lg print-card ${
                      getGrade(result.percentage) === "Fail" ? "bg-red-500" : ""
                    } ${index % 3 === 2 ? "page-break" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">
                        Name: {result.studentId}
                      </h2>
                      <div>
                        <button
                          onClick={() => handleEdit(result)}
                          className="mr-2 bg-green-500 text-white px-2 py-1 rounded print-hide"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(result.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded print-hide"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold">
                        Total Marks: {result.totalMarks}
                      </h3>
                      <h3 className="text-lg font-bold">
                        Obtained Marks: {result.obtainedMarks}
                      </h3>
                      <h3 className="text-lg font-bold">
                        Percentage: {result.percentage.toFixed(2)}%
                      </h3>
                      <h3 className="text-lg font-bold">
                        Grade: {getGrade(result.percentage)}
                      </h3>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">Marks</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(result.marks).map((subject) => (
                          <div
                            key={subject}
                            className={`p-2 rounded ${
                              result.marks[subject] < 33
                                ? "bg-red-200"
                                : "bg-gray-100"
                            }`}
                          >
                            <p className="text-sm font-semibold">
                              {subject.charAt(0).toUpperCase() +
                                subject.slice(1)}
                            </p>
                            <p className="text-sm">{result.marks[subject]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      {editingId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Edit Result</h2>
            <form onSubmit={handleUpdate}>
              <div className="flex flex-wrap mb-4">
                <label className="block text-gray-700 w-32">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={editData.studentId}
                  onChange={(e) =>
                    setEditData({ ...editData, studentId: e.target.value })
                  }
                  className="flex-grow px-3 py-2 border rounded "
                />
              </div>
              <div className="flex flex-wrap mb-4">
                <label className="block text-gray-700 w-32">Class</label>
                <input
                  type="text"
                  name="class"
                  value={editData.class}
                  onChange={(e) =>
                    setEditData({ ...editData, class: e.target.value })
                  }
                  className="flex-grow px-3 py-2 border rounded"
                />
              </div>
              <div className="flex flex-wrap mb-4">
                <label className="block text-gray-700 w-32">
                  Total Marks
                </label>
                <input
                  type="number"
                  name="totalMarks"
                  value={editData.totalMarks}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      totalMarks: parseInt(e.target.value),
                    })
                  }
                  className="flex-grow px-3 py-2 border rounded"
                />
              </div>
              {Object.keys(editData.marks).map((subject) => (
                <div key={subject} className="flex flex-wrap mb-4">
                  <label className="block text-gray-700 w-32">
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </label>
                  <input
                    type="number"
                    name={subject}
                    value={editData.marks[subject]}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        marks: {
                          ...editData.marks,
                          [subject]: parseInt(e.target.value),
                        },
                      })
                    }
                    className="flex-grow px-3 py-2 border rounded"
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="mr-2 px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultList;
