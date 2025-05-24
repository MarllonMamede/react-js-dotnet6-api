import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import './styles.css';
import logoImagem from '../../assets/logo.svg';
import api from '../../services/api';


export default function NewBook() {

    const [id, setId] = useState(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [launchDate, setLaunchDate] = useState('');
    const [price, setPrice] = useState('');

    const { bookId } = useParams();

    const navigate = useNavigate();

    const accessToken = localStorage.getItem('accessToken');
    console.log("Access Token:", accessToken);

    const Authorization = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }

    useEffect(() => {
        if (bookId === '0') return;
        else loadBook();
    }, bookId);

    async function loadBook() {
        try {
            const response = await api.get(`api/book/v1/${bookId}`, Authorization)

            let ajustarData = response.data.launchDate.split("T", 10)[0];

            setId(response.data.id);
            setTitle(response.data.title);
            setAuthor(response.data.author);
            setPrice(response.data.price);
            setLaunchDate(ajustarData);

        } catch (error) {
            alert('Erro ao carregar!')
            navigate('/books');
        }
    }

    async function saveOrUpdate(e) {
        e.preventDefault();

        if (!title || !author || !launchDate || !price) {
            alert('Preencha todos os campos!');
            return;
        }
        const data = {
            title,
            author,
            launchDate: `${launchDate}T00:00:00`,
            price: parseFloat(price),
        };
        try {
            if (bookId === '0') {
                await api.post('api/Book/v1', data, Authorization);
            } else {
                data.id = id;
                await api.put('api/Book/v1', data, Authorization);
            }
        }
        catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Erro ao cadastrar o livro!';
            alert(errorMessage);
        }
        navigate('/books');
    }

    return (
        <div className='new-book-container'>
            <div className='content'>
                <section className='form'>
                    <img src={logoImagem} alt='Erudio' />
                    <h1>{bookId === '0' ? 'Adicionar ' : 'Editar '} livro</h1>
                    <p>{bookId === '0' ? 'Insira as informações do livro e clique em adicionar!' :
                        'Editar as informações do livro e clique em editar! '}</p>
                    <Link className='back-link' to='/books'>
                        <FaArrowLeft size={16} color='#251fc5' />
                        Voltar
                    </Link>
                </section>
                <form onSubmit={saveOrUpdate}>
                    <input
                        placeholder='Titulo'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <input
                        placeholder='Autor'
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                    />
                    <input
                        type='Date'
                        value={launchDate}
                        onChange={e => setLaunchDate(e.target.value)}
                    />

                    <input
                        placeholder='Preço'
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                    <button className='button' type='submit'>{bookId === '0' ? 'Adicionar' : 'Editar'}</button>
                </form>
            </div>
        </div>
    )
}

