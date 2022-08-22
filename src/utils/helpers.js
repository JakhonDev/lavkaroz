import axios from 'axios'

export function slugify(text) {
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
    const to = 'aaaaeeeeiiiioooouuuunc------'

    const newText = text
        .split('')
        .map((letter, i) =>
            letter.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
        )

    return newText
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/&/g, '-y-')
        .replace(/[^\w\-]+/g, '-')
        .replace(/\-\-+/g, '-')
}

export const postDataF = (obj, n = []) => {
    let newObj = structuredClone(obj)
    for (let el in newObj) {
        if (n.includes(el)) {
            delete newObj[el]
        }
    }
    return newObj
}

export async function imageUpload(file) {
    const formData = new FormData()
    formData.append('file', file)
    var config = {
        method: 'post',
        url: 'https://media-app.timeweb-gate.appx.uz/media/upload/ecommerce/image',
        headers: {
            Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImxvZ2luIiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImlhdCI6MTY1NTM5Mzk3MH0.cAc26FC6h4vIjxYm9kYEnmVzykPZ_bHQZ9EQdflheps',
        },
        data: formData,
    }
    return await axios(config)
        .then((res) => {
            if (res.data.success) {
                return res.data.data.file
            }
        })
        .catch((err) => console.log(err))
}

export const postDataWarning = {
    name_uz: "o'zbekcha nomi",
    name_ru: 'ruscha nomi',
    description_uz: "o'zbekcha tasnifi",
    description_ru: "ruscha tasnifi",
    price: 'narxi',
    quantity: 'soni',
    previous_price: 'avvalgi narxi',
    images: 'rasmi',
    category_id: 'kategoriyasi',
}
