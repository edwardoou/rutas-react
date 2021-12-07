import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
    Modal,
    Button,
    TextField,
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const url = "http://localhost:8080/empresas";
const useStyles = makeStyles((theme) => ({
    modal: {
        position: "absolute",
        width: 400,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2, 4, 3),
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
    iconos: {
        cursor: "pointer",
    },
    inputMaterial: {
        width: "100%",
    },
}));

function EmpComponent() {
    const styles = useStyles();
    const [data, setData] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);

    /* valores de los TextField para el form de la consola seleccionada*/
    const [consolaSeleccionada, setConsolaSeleccionada] = useState({
        nombre: "",
        descripcion: ""
    });

    /* almacen de valores ingresados del form*/
    const handleChange = (e) => {
        const { name, value } = e.target;
        setConsolaSeleccionada((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        console.log(consolaSeleccionada);
    };

    /* GET */
    const peticionGet = async () => {
        await axios.get(url + "/listar").then((res) => {
            setData(res.data);
        });
    };

    /* POST */
    const peticionPost = async () => {
        await axios.post(url + "/guardar", consolaSeleccionada).then((res) => {
            setData(data.concat(res.data));
            /* cierra la ventana */
            abrirCerrarModalInsertar();
        });
    };

    /* PUT */
    const peticionPut = async () => {
        await axios
            .put(url + "/actualizar/" + consolaSeleccionada.id, consolaSeleccionada)
            .then((response) => {
                var dataNueva = data;
                dataNueva.map((empresa) => {
                    if (consolaSeleccionada.id === empresa.id) {
                        empresa.nombre = consolaSeleccionada.nombre;
                        empresa.descripcion = consolaSeleccionada.descripcion;
                    }
                });
                setData(dataNueva);
                abrirCerrarModalEditar();
            });
    };

    /* DELETE */
    const peticionDelete = async () => {
        await axios.delete(url + "/eliminar/" + consolaSeleccionada.id).then((response) => {
            setData(data.filter((empresa) => empresa.id !== consolaSeleccionada.id));
            abrirCerrarModalEliminar();
        });
    };

    /* Abrir y cerrar ventana */
    const abrirCerrarModalInsertar = () => {
        setModalInsertar(!modalInsertar);
        /* fuerza que se recargue la pagina con el get */
        peticionGet();
    };
    const abrirCerrarModalEditar = () => {
        setModalEditar(!modalEditar);
    };
    const abrirCerrarModalEliminar = () => {
        setModalEliminar(!modalEliminar);
    };
    /* ... */

    /* en caso editar abrir editar, caso contrario eliminar*/
    const seleccionarConsola = (empresa, caso) => {
        setConsolaSeleccionada(empresa);
        caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
    };

    useEffect(async () => {
        await peticionGet();
        if (!cookies.get('username')) {
            window.location.href = "./";
        }
    }, []);

    /* insertar */
    const bodyInsertar = (
        <div className={styles.modal}>
            <h3>Agregar Nueva Empresa</h3>
            <TextField
                name="nombre"
                className={styles.inputMaterial}
                label="Nombre"
                onChange={handleChange}
            />
            <br />
            <TextField
                name="descripcion"
                className={styles.inputMaterial}
                label="Descripcion"
                onChange={handleChange}
            />
            <br />
            <div align="right">
                <Button color="primary" onClick={() => peticionPost()}>
                    Insertar
                </Button>
                <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
            </div>
        </div>
    );

    /* editar */
    const bodyEditar = (
        <div className={styles.modal}>
            <h3>Editar Empresa</h3>
            <TextField
                name="nombre"
                className={styles.inputMaterial}
                label="Nombre"
                onChange={handleChange}
                value={consolaSeleccionada && consolaSeleccionada.nombre}
            />
            <br />
            <TextField
                name="descripcion"
                className={styles.inputMaterial}
                label="Descripcion"
                onChange={handleChange}
                value={consolaSeleccionada && consolaSeleccionada.descripcion}
            />
            <br />
            <div align="right">
                <Button color="primary" onClick={() => peticionPut()}>
                    Editar
                </Button>
                <Button onClick={() => abrirCerrarModalEditar()}>Cancelar</Button>
            </div>
        </div>
    );

    /* eliminar */
    const bodyEliminar = (
        <div className={styles.modal}>
            <p>
                Estás seguro que deseas eliminar la Empresa{" "}
                <b>{consolaSeleccionada && consolaSeleccionada.nombre}</b> ?{" "}
            </p>
            <div align="right">
                <Button color="secondary" onClick={() => peticionDelete()}>
                    Sí
                </Button>
                <Button onClick={() => abrirCerrarModalEliminar()}>No</Button>
            </div>
        </div>
    );

    /* hmtl */
    return (
        <div className="container">
            <div className="py-5">
                <a type="button" className="salir btn btn-outline-danger btn-light btn-lg" href="/menu">Volver</a>
            </div>
            <TableContainer style={{backgroundColor: "white"}}>
                <Table>
                    <TableHead>
                        <TableRow style={{backgroundColor:'#D6DBDF'}}>
                            <TableCell style={{fontSize: '30px',textAlign:'center'}}>Nombre</TableCell>
                            <TableCell style={{fontSize: '30px',textAlign:'center'}}>Descripcion</TableCell>
                            <TableCell style={{fontSize: '30px',textAlign:'center'}}>Opciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((empresa) => (
                            <TableRow key={empresa.id}>
                                <TableCell style={{fontSize: '20px',textAlign:'center'}}>{empresa.nombre}</TableCell>
                                <TableCell style={{fontSize: '20px',textAlign:'center'}}>{empresa.descripcion}</TableCell>
                                <TableCell style={{fontSize: '20px',textAlign:'center'}}>
                                    <Edit
                                        className={styles.iconos}
                                        onClick={() => seleccionarConsola(empresa, "Editar")}
                                    />
                                    &nbsp;&nbsp;&nbsp;
                                    <Delete
                                        className={styles.iconos}
                                        onClick={() => seleccionarConsola(empresa, "Eliminar")}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="btn container p-4">
                <button type="button" className="btn btn-outline-primary btn-light btn-lg" onClick={() => abrirCerrarModalInsertar()}>Insertar</button>
            </div>

            <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
                {bodyInsertar}
            </Modal>

            <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
                {bodyEditar}
            </Modal>

            <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
                {bodyEliminar}
            </Modal>
        </div>
    );
}

export default EmpComponent;