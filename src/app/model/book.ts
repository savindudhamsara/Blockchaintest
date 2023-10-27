
export interface book {
    bookDoctorID :string,
    patientID: string,
    date: string,
    time: string,
    documents: document[]
}

export interface document {
    name: string,
    url: string
}