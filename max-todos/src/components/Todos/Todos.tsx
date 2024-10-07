import { useContext, useState } from "react";
import { MainContext } from "../../context/MainContext";
import { Droppable, DragDropContext, DropResult } from "react-beautiful-dnd";
import Todo from "./Todo";
import { MenuItem, Select, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import FlipMove from "react-flip-move";
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
const options = [
 'All',
 'Complete',
 'Incomplete'
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const Todos = () => {
  const { todos, moveTodo,setTodos } = useContext(MainContext)!;
  const [deleteSnackOpen, setDeleteSnackOpen] = useState(false);
  const [editSnackOpen, setEditSnackOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const onDragEnd = (x: DropResult) => {
    if (!x.destination) return console.log(x);
    moveTodo(x.source.index, x.destination.index);
    setTimeout(() => setDragging(false), 200);
  };


  const [filter, setFilter] = useState('All');

  const handleChange = (event: any) => {
    console.log(event.target.value)
    setFilter(event.target.value);


  };

  console.log(todos)
  return (
    <>
      <div style={{display: 'flex', justifyContent:'center', margin: 20}}>

        <Select
          style={{width: 550}}
          labelId="demo-mutiple-checkbox-label"
          id="demo-mutiple-checkbox"
          value={filter}
          onChange={(e) => handleChange(e)}
          MenuProps={MenuProps}
          >
          {options.map((op: any) => (
            <MenuItem key={op} value={op}>
              <ListItemText primary={op} />
            </MenuItem>
          ))}
        </Select>
          </div>
      <DragDropContext
        onBeforeDragStart={() => setDragging(true)}
        onDragEnd={onDragEnd}
      >
        <Droppable droppableId="0">
          {(p) => (
            <div {...p.droppableProps} ref={p.innerRef}>
              <FlipMove disableAllAnimations={dragging}>
                {filter === 'All' ?
                
                todos.map((todo, i) => {
                  return (
                    <Todo
                      todo={todo}
                      key={todo.id}
                      onDelete={() => setDeleteSnackOpen(true)}
                      index={i}
                      onEdit={() => setEditSnackOpen(true)}
                    />
                  );
                })
                : null}
                {filter === 'Complete' ?
                
                todos.filter(t=> t.completed).map((todo, i) => {
                  return (
                    <Todo
                      todo={todo}
                      key={todo.id}
                      onDelete={() => setDeleteSnackOpen(true)}
                      index={i}
                      onEdit={() => setEditSnackOpen(true)}
                    />
                  );
                })
                : null}
                {filter === 'Incomplete' ?
                
                todos.filter(t=> t.completed === false).map((todo, i) => {
                  return (
                    <Todo
                      todo={todo}
                      key={todo.id}
                      onDelete={() => setDeleteSnackOpen(true)}
                      index={i}
                      onEdit={() => setEditSnackOpen(true)}
                    />
                  );
                })
                : null}
              </FlipMove>
              {p.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Snackbar
        open={deleteSnackOpen}
        autoHideDuration={4000}
        onClose={() => setDeleteSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={() => setDeleteSnackOpen(false)}
          severity="success"
        >
          Successfully deleted item!
        </Alert>
      </Snackbar>
      <Snackbar
        open={editSnackOpen}
        autoHideDuration={4000}
        onClose={() => setEditSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={() => setEditSnackOpen(false)}
          severity="success"
        >
          Successfully edited item!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Todos;
