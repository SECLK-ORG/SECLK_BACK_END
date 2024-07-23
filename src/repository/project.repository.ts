import projectSchema from '../database/models/project';

export const getAllProjectsRepo = async () => {
try{
    const projects = await projectSchema.find();
    return projects;
}catch(error:any){
    throw new Error(error.message);
}

}