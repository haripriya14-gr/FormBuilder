import React, { useState } from "react";

const FIELD_TYPES = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Select", value: "select" },
  { label: "Checkbox", value: "checkbox" },
];

export default function FormBuilder() {
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ label: "", type: "text", options: "" });
  const [formName, setFormName] = useState("");
  const [savedForms, setSavedForms] = useState(() => {
    const saved = localStorage.getItem('savedForms');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedForm, setSelectedForm] = useState(null);

  React.useEffect(() => {
    localStorage.setItem('savedForms', JSON.stringify(savedForms));
  }, [savedForms]);

  // Save current form to localStorage
  const handleSaveForm = () => {
    if (!formName.trim()) return;
    const newForm = { name: formName.trim(), fields };
    // Overwrite if name exists
    setSavedForms((prev) => {
      const filtered = prev.filter((f) => f.name !== newForm.name);
      return [...filtered, newForm];
    });
    setFormName("");
  };

  // Load a form by name
  const handleLoadForm = (name) => {
    const form = savedForms.find((f) => f.name === name);
    if (form) {
      setFields(form.fields);
      setSelectedForm(name);
    }
  };

  // Delete a form by name
  const handleDeleteForm = (name) => {
    setSavedForms((prev) => prev.filter((f) => f.name !== name));
    if (selectedForm === name) {
      setFields([]);
      setSelectedForm(null);
    }
  };

  // Clear current form
  const handleClearForm = () => {
    setFields([]);
    setSelectedForm(null);
  };

  const handleAddField = () => {
    if (!newField.label) return;
    setFields([
      ...fields,
      {
        ...newField,
        id: Date.now(),
        options:
          newField.type === "select"
            ? newField.options.split(",").map((opt) => opt.trim())
            : undefined,
      },
    ]);
    setNewField({ label: "", type: "text", options: "" });
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleFieldChange = (id, key, value) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Dynamic Form Builder</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Saved Forms:</strong>
        <ul>
          {savedForms.length === 0 && <li>No saved forms</li>}
          {savedForms.map((form) => (
            <li key={form.name} style={{ marginBottom: 4 }}>
              <button onClick={() => handleLoadForm(form.name)} style={{ marginRight: 8 }}>
                {form.name}
              </button>
              <button onClick={() => handleDeleteForm(form.name)} style={{ color: 'red' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Field label"
          value={newField.label}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
        />
        <select
          value={newField.type}
          onChange={(e) => setNewField({ ...newField, type: e.target.value })}
        >
          {FIELD_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {newField.type === "select" && (
          <input
            placeholder="Options (comma separated)"
            value={newField.options}
            onChange={(e) => setNewField({ ...newField, options: e.target.value })}
          />
        )}
        <button onClick={handleAddField}>Add Field</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Form name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
        <button onClick={handleSaveForm} disabled={!fields.length || !formName.trim()}>
          Save Form
        </button>
        <button onClick={handleClearForm} disabled={!fields.length}>
          Clear Current
        </button>
      </div>
      <h2>Dynamic Form Builder</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Field label"
          value={newField.label}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
        />
        <select
          value={newField.type}
          onChange={(e) => setNewField({ ...newField, type: e.target.value })}
        >
          {FIELD_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {newField.type === "select" && (
          <input
            placeholder="Options (comma separated)"
            value={newField.options}
            onChange={(e) => setNewField({ ...newField, options: e.target.value })}
          />
        )}
        <button onClick={handleAddField}>Add Field</button>
      </div>
      <ul>
        {fields.map((field) => (
          <li key={field.id} style={{ marginBottom: 8 }}>
            <input
              value={field.label}
              onChange={(e) => handleFieldChange(field.id, "label", e.target.value)}
              style={{ marginRight: 8 }}
            />
            <span style={{ marginRight: 8 }}>{field.type}</span>
            {field.type === "select" && (
              <input
                value={field.options?.join(", ") || ""}
                onChange={(e) =>
                  handleFieldChange(
                    field.id,
                    "options",
                    e.target.value.split(",").map((opt) => opt.trim())
                  )
                }
                placeholder="Options"
                style={{ marginRight: 8 }}
              />
            )}
            <button onClick={() => handleRemoveField(field.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Form Preview</h3>
      <form style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {fields.map((field) => {
          switch (field.type) {
            case "text":
              return (
                <label key={field.id}>
                  {field.label}
                  <input type="text" name={field.label} />
                </label>
              );
            case "number":
              return (
                <label key={field.id}>
                  {field.label}
                  <input type="number" name={field.label} />
                </label>
              );
            case "select":
              return (
                <label key={field.id}>
                  {field.label}
                  <select name={field.label}>
                    {field.options?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              );
            case "checkbox":
              return (
                <label key={field.id}>
                  <input type="checkbox" name={field.label} /> {field.label}
                </label>
              );
            default:
              return null;
          }
        })}
      </form>
    </div>
  );
}
