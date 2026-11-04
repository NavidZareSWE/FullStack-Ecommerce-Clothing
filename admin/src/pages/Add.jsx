import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { backendURL } from "../config";

const SIZES = ["S", "M", "L", "XL", "XXL"];

// One image slot: keyboard-focusable file input with a live preview.
const ImageSlot = ({ index, file, onChange }) => {
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    // Release the object URL when the image changes (avoids memory leaks)
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const id = `image${index}`;
  return (
    <label
      htmlFor={id}
      className="relative block cursor-pointer rounded border-2 border-transparent transition-colors duration-200 focus-within:border-pink-800 hover:border-gray-300"
    >
      <img
        className="aspect-square w-full animate-fade-in object-cover"
        key={preview || "empty"}
        src={preview || assets.upload_area}
        alt=""
      />
      <span className="sr-only">
        {file
          ? `Image ${index}: ${file.name}. Choose a different image`
          : `Upload image ${index}`}
      </span>
      <input
        onChange={(e) => onChange(e.target.files[0] || false)}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        name={id}
        id={id}
        className="sr-only"
      />
    </label>
  );
};

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSize = (size) =>
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size],
    );

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      if (image1 || image2 || image3 || image4) {
        image1 && formData.append("image1", image1);
        image2 && formData.append("image2", image2);
        image3 && formData.append("image3", image3);
        image4 && formData.append("image4", image4);
      } else {
        toast.error("Upload at least an image.");
        document.getElementById("image1")?.focus();
        return;
      }
      setIsSubmitting(true);
      const response = await axios.post(
        backendURL + "/api/product/add",
        formData,
        { headers: { token } },
      );
      response.data.success
        ? toast.success(response.data.message)
        : toast.error(response.data.message);
      if (response.data.success) {
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setBestSeller(false);
        setSizes([]);
      }
    } catch (error) {
      console.error("Error submitting form", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = [
    [image1, setImage1],
    [image2, setImage2],
    [image3, setImage3],
    [image4, setImage4],
  ];

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex w-full flex-col items-start gap-5"
      aria-labelledby="add-heading"
    >
      <h1 id="add-heading" className="text-xl font-semibold text-gray-900">
        Add a product
      </h1>
      <fieldset>
        <legend className="mb-2">Upload Image</legend>
        <p className="mb-2 text-sm text-gray-600">
          Up to 4 images (JPEG, PNG, WebP, GIF or AVIF, max 10 MB each).
        </p>
        <div className="grid max-w-sm grid-cols-4 gap-2">
          {images.map(([file, setFile], i) => (
            <ImageSlot key={i} index={i + 1} file={file} onChange={setFile} />
          ))}
        </div>
      </fieldset>
      <div className="w-full">
        <label htmlFor="product-name" className="mb-2 block">
          Product Name
        </label>
        <input
          id="product-name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Product Name"
          required
        />
      </div>
      <div className="w-full">
        <label htmlFor="product-description" className="mb-2 block">
          Product Description
        </label>
        <textarea
          id="product-description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write Content here"
          required
        />
      </div>
      <div className="grid w-full grid-cols-1 gap-4 xs:grid-cols-2 sm:flex sm:flex-row sm:gap-8">
        <div>
          <label htmlFor="product-category" className="mb-2 block">
            Product Category
          </label>
          <select
            id="product-category"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="w-full px-3 py-2"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <label htmlFor="product-subcategory" className="mb-2 block">
            Sub category
          </label>
          <select
            id="product-subcategory"
            onChange={(e) => setSubCategory(e.target.value)}
            value={subCategory}
            className="w-full px-3 py-2"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div>
          <label htmlFor="product-price" className="mb-2 block">
            Product Price
          </label>
          <input
            id="product-price"
            onChange={(e) => setPrice(e.target.value)}
            value={price < 0 ? 0 : price}
            min={0}
            max={999_999}
            step="any"
            inputMode="decimal"
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="0.00"
            required
          />
        </div>
      </div>
      <fieldset>
        <legend className="mb-2">Product Sizes</legend>
        <div className="flex flex-wrap gap-3">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              aria-pressed={sizes.includes(size)}
              className={`${
                sizes.includes(size)
                  ? "border-pink-800 bg-pink-100 text-pink-900 shadow-[inset_0px_0px_3px_.25px_#c4b5bd]"
                  : "border-transparent bg-slate-200 text-gray-800"
              } min-h-11 min-w-11 rounded border px-3 py-1 font-medium transition duration-200 active:scale-95`}
            >
              {size}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-2 flex items-center gap-2">
        <input
          onChange={() => setBestSeller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          name="bestseller"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="mt-4 min-h-11 w-full bg-black py-3 text-white transition duration-200 hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-500 xs:w-28"
      >
        {isSubmitting ? "ADDING…" : "ADD"}
      </button>
    </form>
  );
};

export default Add;
