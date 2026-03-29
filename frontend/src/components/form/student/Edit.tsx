import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../../contexts/ToastContext";
import { useLoadingState } from "../../../hooks/useLoadingState";
import { RegisterStudentSchema, registerStudentSchema } from "../../../schemas/registerStudentSchema";

import Button from "../../../components/button/Button";
import { Input } from "../../../components/input";

import style from '../css/Edit.module.css';
import { Form } from ".."; 
import { StudentToBeEdited } from "../../../types/studentToBeEdited";
import { UsersService } from "../../../services/users.service"; 
import { StudentListDTO } from "../../../types/dtos/studentListDTO";
import { StudentListRegisteredTodayDTO } from "../../../types/dtos/studentsListRegisteredTodayDTO";

export type EditProps =  {
  onClick: { closeForm: () => void };
  initialData: StudentToBeEdited;
  onSuccess: () => Promise<void>;
}

const Edit = ({ onClick, onSuccess, initialData }: EditProps) => {
  const { loading, setLoading } = useLoadingState();
  const { showToast } = useToast();

  const studentService = new UsersService<StudentListDTO, StudentListRegisteredTodayDTO, "STUDENT">("STUDENT");

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterStudentSchema>({
    resolver: zodResolver(registerStudentSchema),
    values: {
      name: initialData.name,
      email: initialData.email,
      ra: initialData.ra,
    }
  });

  const handleUpdate = async (data:RegisterStudentSchema) => {
    setLoading(true);

    try {
      const response = await studentService.edit(data, initialData.id);
      
      showToast(response, 'SUCCESS');
      
      await onSuccess();
      onClick.closeForm();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Ocorreu um erro na edição!', 'ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form.Wrapper.Default 
    title="Editar aluno"
    onClose={onClick.closeForm}
    onSubmit={handleSubmit(handleUpdate)}
    description={`Editando informações de ${initialData.name}.`}
    >
      <Input.Form 
        {...register('name')} 
        error={errors.name?.message} 
        label="Nome" 
        className={style.input_form} 
      />
      <Input.Form 
        {...register('email')} 
        error={errors.email?.message} 
        label="E-mail" 
        className={style.input_form} 
      />
      <Input.Form 
        {...register('ra')} 
        error={errors.ra?.message} 
        label="RA (Não alterável)" 
        className={style.input_form} 
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
    </Form.Wrapper.Default>
  );
};

export default Edit;