import slugify from 'slugify';


const generateSlug = (text: string): string => {
    text = text.replace(/\$/gi, "");
    return slugify(text, {
        replacement: "-",
        lower: true,
        remove: /[*+~.()'"!:%$@]/g
      });
}

export default generateSlug;