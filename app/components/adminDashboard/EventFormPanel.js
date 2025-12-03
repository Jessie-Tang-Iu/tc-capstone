"use client";

import { RxCross2 } from "react-icons/rx";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EventFormPanel({
  eventId,
  form,
  errors,
  isReadOnly,
  onChange,
  onSubmit,
  onDelete,
  onClose,
}) {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 text-black">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#E55B3C]">
          {eventId ? "Edit Event" : "Add Event"}
        </h1>
        <button onClick={onClose}>
          <RxCross2 className="text-gray-600 hover:text-black" size={22} />
        </button>
      </div>

      {isReadOnly && (
        <div className="mb-4 rounded-md border border-yellow-500 bg-yellow-100 px-3 py-2 text-yellow-900">
          This event has already passed — fields are view-only.
        </div>
      )}

      {errors.form && (
        <div
          className="mb-4 rounded-md border border-red-500 bg-red-100 px-3 py-2 text-red-700 font-semibold"
          role="alert"
        >
          {errors.form}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col overflow-y-auto">
        {/* ===== Title + Date ===== */}
        <div className="flex gap-4 mb-3 w-full">
          <div className="w-1/2">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              className={`border rounded w-full px-2 py-1 ${
                isReadOnly ? "bg-gray-100 text-gray-500" : ""
              }`}
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              required
              disabled={isReadOnly}
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="date">Date:</label>
            <input
              id="date"
              type="date"
              className={`border rounded w-full px-2 py-1 ${
                isReadOnly ? "bg-gray-100 text-gray-500" : ""
              }`}
              value={form.date}
              onChange={(e) => onChange("date", e.target.value)}
              required
              disabled={isReadOnly}
            />
            <p className="text-red-500 text-sm min-h-[1.25rem]">
              {errors.date}
            </p>
          </div>
        </div>

        {/* ===== Start + End Time ===== */}
        <div className="flex gap-4 mb-3 w-full">
          <div className="w-1/2">
            <label htmlFor="startTime">Start Time:</label>
            <input
              id="startTime"
              type="time"
              className={`border rounded w-full px-2 py-1 ${
                isReadOnly ? "bg-gray-100 text-gray-500" : ""
              }`}
              value={form.startTime || ""}
              onChange={(e) => onChange("startTime", e.target.value || null)}
              disabled={isReadOnly}
            />
            <p className="text-red-500 text-sm min-h-[1.25rem]">
              {errors.startTime}
            </p>
          </div>

          <div className="w-1/2">
            <label htmlFor="endTime">End Time:</label>
            <input
              id="endTime"
              type="time"
              className={`border rounded w-full px-2 py-1 ${
                isReadOnly ? "bg-gray-100 text-gray-500" : ""
              }`}
              value={form.endTime || ""}
              onChange={(e) => onChange("endTime", e.target.value || null)}
              disabled={isReadOnly}
            />
            <p className="text-red-500 text-sm min-h-[1.25rem]">
              {errors.endTime}
            </p>
          </div>
        </div>

        {/* ===== Other Fields ===== */}
        <label htmlFor="location">Location:</label>
        <input
          id="location"
          type="text"
          className={`border rounded mb-3 px-2 py-1 ${
            isReadOnly ? "bg-gray-100 text-gray-500" : ""
          }`}
          value={form.location}
          onChange={(e) => onChange("location", e.target.value)}
          placeholder="online | The Platform"
          required
          disabled={isReadOnly}
        />

        <label htmlFor="description">Description:</label>
        <div className="mb-3">
          <ReactQuill
            theme="snow"
            readOnly={isReadOnly}
            value={form.description}
            onChange={(value) => onChange("description", value)}
            placeholder="Full description will show up on the event detail page"
            className="bg-white text-black"
          />
        </div>

        <label htmlFor="highlight">Highlight:</label>
        <textarea
          id="highlight"
          className={`border rounded mb-3 px-2 py-1 ${
            isReadOnly ? "bg-gray-100 text-gray-500" : ""
          }`}
          value={form.highlight}
          onChange={(e) => onChange("highlight", e.target.value)}
          disabled={isReadOnly}
          placeholder="The highlight will show up bolded on the event card"
        />

        <label htmlFor="price">Price:</label>
        <input
          id="price"
          type="number"
          className={`border rounded mb-4 px-2 py-1 ${
            isReadOnly ? "bg-gray-100 text-gray-500" : ""
          }`}
          value={form.price}
          onChange={(e) => onChange("price", e.target.value)}
          disabled={isReadOnly}
        />

        {/* Buttons */}
        <div className="mt-4 flex gap-3 justify-center">
          {!isReadOnly && (
            <button
              type="submit"
              className={`rounded-md px-5 py-2 font-semibold text-white transition 
        ${
          errors.date || errors.startTime || errors.endTime
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#E55B3C] hover:bg-[#d24a2e]"
        }`}
              disabled={!!errors.date || !!errors.startTime || !!errors.endTime}
            >
              Save
            </button>
          )}
          {eventId && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-md bg-gray-600 hover:bg-red-600 text-white px-5 py-2 font-semibold transition"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
