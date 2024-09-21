import React, { useEffect, useState } from 'react';
import StepOne from './projectStepOne';
import StepTwo from './projectStepTwo';
import {
  useCreateProjectMutation,
  useUploadFilesMutation,
} from '../../store/slices/api/apiSlice';
import { useSelector } from 'react-redux';

const ProjectForm = () => {
  const [step, setStep] = useState(0);
  const [createProject] = useCreateProjectMutation();
  const [uploadFiles] = useUploadFilesMutation();
  const { user } = useSelector((state) => state.auth);
  const [files, setFiles] = useState([]);
  const [attached, setAttached] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    createdAt: null,
    createdBy: user._id,
    deadline: null,
    participants: [],
    guests: [],
    brief: null,
  });

  const handleStepOneSubmit = (e, data) => {
    try {
      setFiles(data.files); // Store the files temporarily
      const title = data.title.replace(/\s/g, '');
      const attachedFiles = data.files.map(file => ({
        filePath: `http://localhost:5173/client/public/assets/projects/${title}/${file.name.replace(/\s/g, '_')}`,
        fileName: file.name.replace(/\s/g, '_'),
      }));
      setAttached(attachedFiles); // Prepare attached files data
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: data.title,
        deadline: data.deadline,
        brief: {
          content: data.brief[0].content,
        },
      }));
      setStep(1);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    if (attached.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        brief: {
          ...prevFormData.brief,
          attached: attached, // Include attached files in form data
        },
      }));
    }
  }, [attached]);

  const handleBack = (e) => {
    e.stopPropagation();
    setStep(0);
  };

  const handleStepTwoSubmit = (data) => {
    try {
      data.participants.forEach(participant => {
        participant.joinDate = new Date();
      });
      data.guests.forEach(guest => {
        delete guest.role;
        guest.joinDate = new Date();
      });

      setFormData((prevFormData) => ({
        ...prevFormData,
        participants: data.participants,
        guests: data.guests,
      }));

      setFormSubmitted(true); // Trigger final submission
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitUpload = async () => {
    const title = formData.title.replace(/\s/g, '');
    try {
      const uploadResponse = await uploadFiles({ title, files }).unwrap(); // Upload files using RTK Query

      // Assuming the server response contains the file paths
      const uploadedFiles = uploadResponse.map(file => ({
        filePath: file.filePath,
        fileName: file.fileName,
      }));

      setAttached(uploadedFiles); // Update attached files data after upload

    } catch (error) {
      console.error('File upload failed:', error);
      throw error; // Rethrow error to handle it during form submission
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      handleSubmit(); // Trigger form submission once files are uploaded
    }
  }, [formSubmitted]);

  const handleSubmit = async () => {
    try {
      console.log(formData);
      const response = await createProject(formData).unwrap(); // Send the project creation request using RTK mutation
      
      await handleSubmitUpload(); 

      console.log('Project created successfully:', response);

    } catch (error) {
      console.error('Project creation failed:', error);
    }
  };

  return (
    <> 
      {step === 0 && <StepOne onSubmit={handleStepOneSubmit} />}
      {step === 1 && <StepTwo onSubmitForm={handleStepTwoSubmit} onBack={handleBack}/>}
    </>
  );
};

export default ProjectForm;
