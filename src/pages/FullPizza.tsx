import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FullPizza: React.FC = () => {
    const [pizza, setPizza] = React.useState<{
      imageUrl: string;
      title: string;
      price: number;
    }>();
    const {id} = useParams();
    const navigate = useNavigate()

    React.useEffect(() => {
        async function fetchPizza() {
        try
        {const {data} = await axios.get(
              "https://628e7a35368687f3e7179014.mockapi.io/items/" + id
            );
            setPizza(data);
        } catch (error) {
        alert('Ошибка при получении пиццы!');
      navigate("/")
      }
        }
        fetchPizza()
    }, []);

      if (!pizza) {
        return <>Загрузка...</>;
      }

  return (
    <div className="container">
      <img src={pizza.imageUrl}  alt="Pizza"/>
      <h2>{pizza.title}</h2>
      <h4>{pizza.price} ₽</h4>
    </div>
  );
}

export default FullPizza