import "./card.css";
const Card = ({ title, image, price }) => {
  return (
    <div className="border rounded-lg shadow-md p-4" id="card">
      <img src={image} alt={title} />
      <h2 className="text-lg font-semibold mt-2">{title}</h2>
      <p className="text-gray-700">R$ {price}</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
        Comprar
      </button>
    </div>
  );
};

export default Card;
