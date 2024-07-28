import React, { useState } from 'react';
import { db } from '../firebase/Config';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const ResultForm = () => {
  const [studentId, setStudentId] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [marks, setMarks] = useState({});
  const [totalMarks, setTotalMarks] = useState(0);
  const [obtainedMarks, setObtainedMarks] = useState(0);

  const subjectsGeneral = { english: '', math: '', science: '', Urdu: '', English: '', Islamiat: '',  };
  const subjectsClass9And10 = {
    physics: '',
    bio: '',
    chemistry: '',
    english: '',
    urdu: '',
    math: '',
    mquran: '',
    mpakistan: '',
    islamiat: ''
  };

  const getSubjects = () => {
    if (classLevel === '9th' || classLevel === '10th') {
      return subjectsClass9And10;
    }
    return subjectsGeneral;
  };

  const handleMarksChange = (e) => {
    const { name, value } = e.target;
    setMarks((prevMarks) => ({
      ...prevMarks,
      [name]: value,
    }));
    calculateObtainedMarks({ ...marks, [name]: value });
  
  };

  const calculateObtainedMarks = (updatedMarks) => {
    const obtained = Object.values(updatedMarks).reduce((acc, mark) => acc + Number(mark), 0);
    setObtainedMarks(obtained);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, 'results'), {
      studentId,
      class: classLevel,
      marks,
      totalMarks,
      obtainedMarks,
    });
    toast.success('Result added successfully');

    setStudentId('');
    setClassLevel('');
    setMarks({});
    setTotalMarks(0);
    setObtainedMarks(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Result</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Class</label>
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Class</option>
              {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          {Object.keys(getSubjects()).map((subject) => (
            <div key={subject} className="mb-4">
              <label className="block text-gray-700">{subject.charAt(0).toUpperCase() + subject.slice(1)}</label>
              <input
                type="number"
                name={subject}
                value={marks[subject] || ''}
                onChange={handleMarksChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          ))}
          <div className="mb-4">
            <label className="block text-gray-700">Total Marks</label>
            <input
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Obtained Marks</label>
            <input
              type="number"
              value={obtainedMarks}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResultForm;
