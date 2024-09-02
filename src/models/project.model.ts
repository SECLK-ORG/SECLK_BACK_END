export interface createProjectDto{
    clientContactNumber: number;
    clientEmail: string;
    projectName: string;
    startDate: string;
    endDate: string;
    status: string;
    createdBy: string;
    category: string;
  }

export interface updateProjectDto {
    clientContactNumber: number;
    clientEmail: string;
    projectName: string;
    startDate: string;
    endDate: string;
    status: string;
    createdBy: string;
    category: string;
}