
export type DalleError = {
    code: number,
    message: string,
    param: string,
    type: string 
}

export type ImageResponse = {
  success: boolean,
  amount : number,
  image  : DalleResponse,
  error  : DalleError,
}

export type DalleResponse = {
    created: number,
    data   : {
        b64_json: string
    }[],
    success: boolean
}


