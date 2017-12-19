
export interface UserOptions {
  username: string,
  password: string
}

export interface UserSign {
  username: string,
  password: string,
  RealName: string,
  phone: string,
  verificationCode: string
}

export interface findPassword {
  phone: string,
  password: string,
  password1: string,
  verificationCode: string
}
