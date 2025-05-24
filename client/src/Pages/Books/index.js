import React, { useState, useEffect } from "react";
import './styles.css';
import logoImagem from '../../assets/logo.svg';
import { Link, useParams } from "react-router-dom";
import { FaPowerOff, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Books() {

    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);

    const userName = localStorage.getItem('userName');

    const accessToken = localStorage.getItem('accessToken');
    console.log("Access Token:", accessToken);

    const Authorization = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }

    const navigate = useNavigate();

    useEffect(() => {
        fetchMoreBook();
    }, [accessToken]);

    async function fetchMoreBook() {
        const response = await api.get(`api/Book/v1/asc/4/${page}`, Authorization);
        setBooks([...books, ...response.data.list]);
        setPage(page + 1);
    }

    async function logout() {
        try {
            localStorage.clear();
            navigate('/');
        } catch (error) {
            alert('Erro no Logout!');
        }
    }

    async function deleteBook(id) {
        try {
            await api.delete(`api/Book/v1/${id}`, Authorization);
            setBooks(books.filter(book => book.id !== id))
        }
        catch (error) {
            alert('Erro ao deletar livro!');
        }
    }

    async function alterarBook(id) {
        try {
            navigate(`new/${id}`);
        }
        catch (error) {
            alert('Erro ao Editar o livro!');
        }
    }

    return (
        <div className="book-container">
            <header>
                <img src={logoImagem} alt="Erudio" />
                <span>Bom Dia, <strong>{userName.toLowerCase()}</strong>!</span>
                <Link className="button" to="new/0">Adicionar novo Livro</Link>
                <button onClick={logout} type="button">
                    <FaPowerOff size={18} color="#251fc5" />
                </button>
            </header>
            <h1>Registros de livros </h1>
            <p><strong>Total de livros:</strong> {books.length}</p>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        <strong>Titulo:</strong>
                        <p>{book.title}</p>
                        <strong>Autor:</strong>
                        <p>{book.author}</p>
                        <strong>Preço:</strong>
                        <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(book.price)}</p>
                        <strong>Data de lançamento:</strong>
                        <p>{new Date(book.launchDate).toLocaleDateString('pt-BR')}</p>
                        <button onClick={() => alterarBook(book.id)} type="button">
                            <FaEdit size={20} color="#251fc5" />
                        </button>
                        <button onClick={() => deleteBook(book.id)} type="button">
                            <FaTrash size={20} color="#251fc5" />
                        </button>
                    </li>
                ))}
            </ul>
            <button className="button" onClick={fetchMoreBook} type="button">Carregar Mais</button>
        </div>
    )
}
