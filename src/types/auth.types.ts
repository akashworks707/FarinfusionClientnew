export interface IRegister {
    name: string
    email: string
    password: string,
    address: string,
    phone: string
}

export interface ILogin {
    email: string,
    password: string
}

export interface IRegisterResponse {
    _id: string
    name: string
    email: string
    password: string
    role: string
    isDeleted: boolean
    isActive: string
    isVerified: boolean
    salary?: number;
    createdAt?: string
    updatedAt?: string
}




