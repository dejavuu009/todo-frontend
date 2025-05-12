"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ConfirmDeleteModal from "../dashboard/ConfirmDeleteModal";
import { Button } from "react-bootstrap";
import ColorPickerModal from "./ColorPickerModal";
import { FaThumbtack } from "react-icons/fa";
import AddTodoForm from "./AddTodoForm";
import { FiEdit, FiTrash } from 'react-icons/fi';

interface Todo {
  id: number;
  title: string;
  description?: string;
  color?: string;
  status: string;
  order?: number;
  pinned?: boolean;
}

const fetchTodos = async (): Promise<Todo[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todo`);
  return res.json();
};

const updateOrder = async (todos: Todo[]) => {
  await fetch("/api/todo", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      todos.map((todo, index) => ({ id: todo.id, order: index }))
    ),
  });
};

function SortableItem({
  id,
  title,
  description,
  color,
  status,
  pinned,
  onDelete,
  onTogglePin,
}: Todo & { onDelete: (id: number) => void; onTogglePin: (id: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description || "");
  const [editedStatus, setEditedStatus] = useState(status);
  const [isPinned, setIsPinned] = useState(pinned ?? false);


  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (updatedTodo: {
      id: number;
      title: string;
      description: string;
      status: string;
      color: string;
      pinned: boolean;
    }) => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleSave = () => {
    const newColor =
      editedStatus === "done"
        ? "#DBFFCB"
        : editedStatus === "in progress"
        ? "#FFDF88"
        : "#F75A5A";

    updateMutation.mutate({
      id,
      title: editedTitle,
      description: editedDescription,
      status: editedStatus,
      color: newColor,
      pinned: isPinned,
    });

    setIsEditing(false);
  };

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: color || "#f8f9fa",
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    marginBottom: "1rem",
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        style={{ position: "absolute", top: 10, right: 10, cursor: "pointer" }}
        onClick={() => onTogglePin(id)}
      >
        <FaThumbtack
          size={25}
          color={pinned ? "#000957" : "#FABC3F"}
          style={{ transform: pinned ? "rotate(0deg)" : "rotate(45deg)"  }}
        />
      </div>
      {isEditing ? (
        <div>
          <input
            type="text"
            className="form-control mb-2"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <select
            className="form-select mb-2"
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
          >
            <option value="todo">Todo</option>
            <option value="in progress">In progress</option>
            <option value="done">Done</option>
          </select>
          <div className="d-flex justify-content-between">
            <button className="btn btn-success" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h5>{title}</h5>
          {description && <p>{description}</p>}
          <span
            className={`badge ${
              status === "done"
                ? "bg-success"
                : status === "in progress"
                ? "bg-warning text-dark"
                : "bg-danger"
            }`}
          >
            {status}
          </span>
          <div className="mt-2 d-flex justify-content-end gap-2">
            <button
              className="btn btn-outline-primary btn-sm me-2 d-flex align-items-center gap-1"
              onClick={() => setIsEditing(true)}
            >
              <FiEdit /> Edit
            </button>
            <button
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              onClick={() => onDelete(id)}
            >
              <FiTrash /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function TodoList({ showOnlyPinned = false }: { showOnlyPinned?: boolean }) {
  const colorButtonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState("#ffffff");
  const [newStatus, setNewStatus] = useState("todo");
  const [localTodos, setLocalTodos] = useState<Todo[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  useEffect(() => {
    if (todos.length > 0) {
      setLocalTodos([...todos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    }
  }, [todos]);

  const createMutation = useMutation({
    mutationFn: async (newTodo: {
      title: string;
      description: string;
      color: string;
      status: string;
    }): Promise<Todo> => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todo`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const togglePinMutation = useMutation({
    mutationFn: async (id: number) => {
      const todo = localTodos.find(t => t.id === id);
      if (!todo) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/todo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pinned: !todo.pinned }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = localTodos.findIndex((todo) => todo.id === active.id);
      const newIndex = localTodos.findIndex((todo) => todo.id === over.id);
      const newOrder = arrayMove(localTodos, oldIndex, newIndex);
      setLocalTodos(newOrder);
      reorderMutation.mutate(newOrder);
    }
  };

  const confirmDelete = (id: number) => {
    setSelectedTodoId(id);
    setShowModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (selectedTodoId !== null) {
      deleteMutation.mutate(selectedTodoId);
      setShowModal(false);
      setSelectedTodoId(null);
    }
  };

  return (
    <div className="container mt-4">
      <AddTodoForm onCreate={(newTodo) => createMutation.mutate(newTodo)} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localTodos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="row">
            {localTodos
            .filter(todo => showOnlyPinned ? todo.pinned : true)
            .map((todo) => (
              <div key={todo.id} className="col-md-6 col-lg-4">
                <SortableItem
                  {...todo}
                  onDelete={confirmDelete}
                  onTogglePin={(id) => togglePinMutation.mutate(id)}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <ConfirmDeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDeleteConfirmed}
      />
      <ColorPickerModal
        show={showColorModal}
        onClose={() => setShowColorModal(false)}
        onColorSelect={(color) => {
          setSelectedColor(color);
          setNewColor(color);
        }}
        selectedColor={selectedColor}
        targetRef={colorButtonRef}
      />
      
    </div>
  );
}
