function Input({ label, type, value, onChange, id ,placeholder}) {
  return (
    <div className="flex flex-col">
      <label className="mt-1 font-bold" htmlFor={id}>{label}</label>
      <input
        className=" mt-1 px-4 py-2 w-full max-w-[400px] text-black border-2 border-grey-500 rounded-md outline-none focus:border-blue-700"
        type={type}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        id={id}
        placeholder={placeholder}
      ></input>
    </div>
  );
}

export default Input;
