import { useState, useEffect } from "react";
import { Page } from "./Page";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { toast, ToastContainer } from "react-toastify";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

interface Professor {

  siape: string;
  nome: string;
  disciplinas: Disciplina[];
}

interface Disciplina {

  id: string;
  nome: string;
}

export function AtribuirDisciplinasProfessor() {

  const [professores, setProfessores] = useState<Professor[]>([
    { siape: "123", nome: "Professor 1", disciplinas: [] },
    { siape: "456", nome: "Professor 2", disciplinas: [] },
    { siape: "666", nome: "Professor 3", disciplinas: [] },
  ]);

  const [disciplinas] = useState<Disciplina[]>([
    { id: "1", nome: "Matematica 1" },
    { id: "2", nome: "Disciplina 2" },
  ]);

  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<Disciplina | null>(null);
  const [open, setOpen] = useState(false);
  const [professorSelecionado, setProfessorSelecionado] = useState<Professor | null>(null);
  const [toastExibindo, setToastExibindo] = useState(false);

  useEffect(() => {
    if (disciplinaSelecionada && !disciplinas.includes(disciplinaSelecionada)) {
      setDisciplinaSelecionada(null);
    }
  }, [disciplinas, disciplinaSelecionada]);

  const adicionarDisciplina = (professor: Professor | null) => {
    if (!disciplinaSelecionada || !professor) {
      if (!toastExibindo) {
        toast.error("Nenhuma disciplina ou professor selecionado", {
          onClose: () => setToastExibindo(false),
          onOpen: () => setToastExibindo(true),
        });
      }
      return;
    }

    // Verificar se a disciplina já foi atribuída ao professor
    if (professor.disciplinas.find((d) => d.id === disciplinaSelecionada.id)) {
      if (!toastExibindo) {
        toast.error("Disciplina já atribuída ao professor", {
          onClose: () => setToastExibindo(false),
          onOpen: () => setToastExibindo(true),
        });
      }
      return;
    }

    const novoProfessor = {
      ...professor,
      disciplinas: [...professor.disciplinas, disciplinaSelecionada],
    };

    setProfessores(
      professores.map((prof) =>
        prof.siape === novoProfessor.siape ? novoProfessor : prof
      )
    );
    setOpen(false);
  };

  const handleOpen = (professor: Professor) => {
    setProfessorSelecionado(professor);
    setOpen(true);
  };
  
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <Page>
      <ToastContainer position="bottom-center" />
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center my-4">
          Atribuir Disciplinas ao Professor
        </h1>
        {professores.map((professor) => (
          <div
            key={professor.siape}
            className="bg-white shadow-lg rounded-lg p-6 mb-6"
          >
            <h2 className="text-xl font-semibold mb-2">{professor.nome}</h2>
            <p className="text-gray-700">SIAPE: {professor.siape}</p>
            <p className="text-gray-700">
              Disciplinas: {professor.disciplinas.length}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => handleOpen(professor)}
            >
              Adicionar Disciplina
            </button>

            <button
                className="mt-4 ml-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setOpenPopup(true)}
              >
                Disciplinas do Professor
              </button>
          </div>
        ))}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Adicionar Disciplina</DialogTitle>
          <DialogContent>
            <select
              className="border-2 border-gray-400 rounded px-2 py-2"
              onChange={(e) => {
                const disciplinaId = e.target.value;
                const disciplina = disciplinas.find(
                  (d) => d.id === disciplinaId
                );
                setDisciplinaSelecionada(disciplina || null);
              }}
            >
              <option value="">Selecione uma disciplina</option>
              {disciplinas.map((disciplina) => (
                <option key={disciplina.id} value={disciplina.id}>
                  {disciplina.nome}
                </option>
              ))}
            </select>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => adicionarDisciplina(professorSelecionado)}
              color="primary"
              disabled={!disciplinaSelecionada}
            >
              Adicionar
            </Button>
            <Button
              onClick={() => setOpen(false)}
              color="secondary"
              variant="outlined"
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>

          <DialogTitle>Disciplinas do Professor</DialogTitle>
            <TableContainer>
              <Table aria-label="simple table">
                <TableBody>
                  {disciplinas.filter(dis => dis.id == (String)(professorSelecionado?.disciplinas.filter(profdis => profdis.id))).map((disciplinas) => (

                      <TableRow key={disciplinas.id}>
                        <TableCell align="center"> {disciplinas.nome} </TableCell>
                      </TableRow>
                
                    ))}
                  
                </TableBody>
              </Table>
            </TableContainer>
          <DialogActions>
            
            <Button onClick={() => setOpenPopup(false)} color="secondary" variant="outlined">Sair</Button>

          </DialogActions>

        </Dialog>

      </div>
    </Page>
  );
}
