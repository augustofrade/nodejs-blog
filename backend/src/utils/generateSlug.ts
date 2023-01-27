import slugify from 'slugify';


const generateSlug = (text: string): string => {
    return slugify(text, {
        replacement: "-",
        lower: true,
        remove: /[*+~.()'"!:%$@]/g
      });
}

export default generateSlug;