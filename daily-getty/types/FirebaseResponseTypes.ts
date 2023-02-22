export type DatabaseError = {
    code: number,
    message: string,
    param: string,
    type: string 
}

export type DatabaseResponse = {
  success: boolean,
  error  : DatabaseError,
}

export type DatabaseUser = {
  id: string,
  name: string,
  email: string,
  googleId: string,
}

export type DatabaseImage = {
  id: string,
  userId: string,
  creationDate: number,
  userPrompt: string,
  givenPrompt: string,
  likes: number,
}



