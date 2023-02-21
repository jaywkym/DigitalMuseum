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

