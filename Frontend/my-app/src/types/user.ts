export interface UserDto {
  id?: string | null;
  firstName: string;
  lastName?: string | null;
  about?: string | null;
  jobType: string;
  jobLevel: string;
  createdDateTime: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName?: string | null;
  about?: string | null;
  jobType: string;
  jobLevel: string;
  createdDateTime?: string;
}
