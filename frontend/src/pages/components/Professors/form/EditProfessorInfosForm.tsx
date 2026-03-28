import { useForm } from "react-hook-form";
import { RegisterProps } from "./RegisterProfessorForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../../../contexts/ToastContext";
import { useLoadingState } from "../../../../hooks/useLoadingState";

import Button from "../../../../components/button/Button";
import { Input } from "../../../../components/input";

import style from '../../../css/Students.module.css';
import ProfessorPageFormsWrapper from "./ProfessorPageFormsWrapper";
import { ProfessorToBeEdited } from "../../../../types/professorToBeEdited";
import { registerProfessorSchema, RegisterProfessorSchema } from "../../../../schemas/registerProfessorSchema";
import { UsersService } from "../../../../services/users.service"; 
import { ProfessorListDTO } from "../../../../types/dtos/professorListDTO";
import { ProfessorsListRegisteredTodayDTO } from "../../../../types/dtos/professorsListRegisteredTodayDTO";
import { Select } from "../../../../components/select";

export type EditProps = RegisterProps & {
  initialData: ProfessorToBeEdited;
}

const Edit = ({ onClick, onSuccess, initialData }: EditProps) => {
  const { loading, setLoading } = useLoadingState();
  const { showToast } = useToast();

  const ProfessorService = new UsersService<ProfessorListDTO, ProfessorsListRegisteredTodayDTO, "PROFESSOR">("PROFESSOR");

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterProfessorSchema>({
    resolver: zodResolver(registerProfessorSchema),
    values: {
      name : initialData.name,
      email         : initialData.email,
      discipline    : initialData.discipline,
    }
  });

  const handleUpdate = async (
    data : RegisterProfessorSchema
  ):Promise<void> => {
    setLoading(true);

    try {
      const response = await ProfessorService.edit(data, initialData.id);
      
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
    <ProfessorPageFormsWrapper 
    title="Editar professor"
    onClose={onClick.closeForm}
    onSubmit={handleSubmit(handleUpdate)}
    description={`Editando informações de ${initialData.name}.`}
    >
      <Input.Form 
        {...register('name')} 
        error={errors.name?.message} 
        label="Nome" 
        className={style.add_student_form} 
      />
      <Input.Form 
        {...register('email')} 
        error={errors.email?.message} 
        label="E-mail" 
        className={style.add_student_form} 
      />
      <Select.Form 
        {...register('discipline')}
        selectSchema="PROFESSORS_DISCIPLINES_OPTIONS" 
        error={errors.discipline?.message} 
        label="Disciplina" 
        className={style.add_student_form} 
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
    </ProfessorPageFormsWrapper>
  );
};

export default Edit;