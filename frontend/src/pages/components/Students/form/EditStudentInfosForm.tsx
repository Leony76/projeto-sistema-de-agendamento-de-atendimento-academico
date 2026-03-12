import { useForm } from "react-hook-form";
import { RegisterProps } from "./RegisterStudentForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../../../contexts/ToastContext";
import { useLoadingState } from "../../../../hooks/useLoadingState";
import { RegisterStudentSchema, registerStudentSchema } from "../../../../schemas/registerStudentSchema";

import Button from "../../../../components/button/Button";
import Input from "../../../../components/input/Input";
import axios from "axios";

import style from '../../../css/Students.module.css';
import StudentPageFormsWrapper from "./StudentPageFormsWrapper";
import { StudentToBeEdited } from "../../../../types/studentToBeEdited";

export type EditProps = RegisterProps & {
  initialData: StudentToBeEdited;
}

const Edit = ({ onClick, onSuccess, initialData }: EditProps) => {
  const { loading, setLoading } = useLoadingState();
  const { showToast } = useToast();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterStudentSchema>({
    resolver: zodResolver(registerStudentSchema),
    values: {
      studentName: initialData.name,
      email: initialData.email,
      ra: initialData.ra,
    }
  });

  const handleUpdate = async (data: RegisterStudentSchema) => {
    setLoading(true);

    const fetchURL = `http://localhost:3000/api/students/update/${initialData.ra}`;

    try {
      const response = await axios.put(fetchURL, data);
      
      showToast(response.data.success, 'SUCCESS');
      
      await onSuccess();
      onClick.closeForm();
    } catch (error: any) {
      showToast(error.response?.data?.error, 'ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentPageFormsWrapper 
    title="Editar aluno"
    onClose={onClick.closeForm}
    onSubmit={handleSubmit(handleUpdate)}
    description={`Editando informações de ${initialData.name}.`}
    >
      <Input 
        {...register('studentName')} 
        error={errors.studentName?.message} 
        label="Nome" 
        variant="FORM" 
        className={style.add_student_form} 
      />
      <Input 
        {...register('email')} 
        error={errors.email?.message} 
        label="E-mail" 
        variant="FORM" 
        className={style.add_student_form} 
      />
      <Input 
        {...register('ra')} 
        error={errors.ra?.message} 
        label="RA (Não alterável)" 
        variant="FORM" 
        className={style.add_student_form} 
        disabled 
      />
      
      <Button 
      loading={loading} 
      buttonStyle={{ 
        fontSize: 'XL', 
        border: 'XL', 
        color: 'SECONDARY', 
        filled: false 
      }}>
        {loading ? 'Salvando' : 'Salvar Alterações'}
      </Button>
    </StudentPageFormsWrapper>
  );
};

export default Edit;