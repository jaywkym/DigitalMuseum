
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
        url: string
    }[],
    success: boolean
}

export type PromptResponse = {
    success: boolean,
    prompts: string[]
}


