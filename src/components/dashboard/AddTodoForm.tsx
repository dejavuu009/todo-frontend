"use client";

import { useState, useRef } from "react";
import { Button, Collapse } from "react-bootstrap";
import ColorPickerModal from "./ColorPickerModal";

type TodoInput = {
  title: string;
  description: string;
  color: string;
  status: string;
};

export default function AddTodoForm({
  onCreate,
}: {
  onCreate: (todo: TodoInput) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [status, setStatus] = useState("todo");
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const colorButtonRef = useRef<HTMLButtonElement>(null);

  const handleAdd = () => {
    if (title.trim()) {
      onCreate({ title, description, color, status });
      setTitle("");
      setDescription("");
      setColor("#28a745");
      setStatus("todo");
      setOpen(false);
    }
  };

  return (
    <div className="card p-3 mb-4 shadow-sm"
    style={{
        backgroundColor: '#F5FCFF', 
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          
        }}
      >
        <h5 className="mb-0">➕ Click to add new note</h5>
        <span>{open ? "−" : "+"}</span>
      </div>

      <Collapse in={open}>
        <div>
          <div className="mt-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="d-flex mb-3">
              <Button
                style={{
                  backgroundColor: "#D0F4FF",
                  borderColor: "#D0F4FF",
                  color: "#1c1c1c",
                }}
                ref={colorButtonRef}
                onClick={() => setShowColorModal(true)}
              >
                Set Color
              </Button>
            </div>
            <label className="form-label">Status</label>
            <select
              className="form-select mb-3"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="todo">Todo</option>
              <option value="in progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <Button
              style={{
                backgroundColor: "#D0F4FF",
                borderColor: "#D0F4FF",
                color: "#1c1c1c",
              }}
              onClick={handleAdd}
              className="w-100 btn-primary"
            >
              Add ToDo
            </Button>
          </div>
        </div>
      </Collapse>

      <ColorPickerModal
        show={showColorModal}
        onClose={() => setShowColorModal(false)}
        onColorSelect={(color) => {
          setSelectedColor(color);
          setColor(color);
        }}
        selectedColor={selectedColor}
        targetRef={colorButtonRef}
      />
    </div>
  );
}
