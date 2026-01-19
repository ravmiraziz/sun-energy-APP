import React from "react";

const AddProduct: React.FC = () => {
  return (
    <>
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <title>Add New Product Modal | Smart Energy Admin</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            'body {\n    font-family: "Plus Jakarta Sans", sans-serif\n    }\n.form-input:focus {\n    border-color: #09f6b3 !important;\n    box-shadow: 0 0 0 1px #09f6b3 !important\n    }\n.custom-select {\n    appearance: none;\n    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuB-L7aOFAharW4SVhNUOu5HEHSOYoQWwxbIQeM1z9AUc77CF-dagal1tDQ2K3DCrAu1WYo-qyMEqZ0YTJgctIVRh6GiLFm39v0bmnjApJBTvsdKqhCvuLCaPl2oo15-B55VWUIGgZCMLf9wVZrkdJ6OHKk46zr0pv-9IghACG0puRhpeDxo7NZEEWoYgZXBDk8sUTEAeCjD6RolFOz629DOPBkYUIIprY3u19FbqJGrolsNQF1Y6OqPvIPBjwDJG2pdYS_6rrV0Qx8e);\n    background-position: right 0.5rem center;\n    background-repeat: no-repeat;\n    background-size: 1.5em 1.5em\n    }',
        }}
      />
      {/* Background Content (Simulated Products Management Screen) */}
      <div className="fixed inset-0 w-full h-full p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto opacity-20 pointer-events-none">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Products Management
            </h1>
            <div className="bg-primary px-4 py-2 rounded-lg text-black font-semibold">
              Add Product
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-modal-dark h-48 rounded-xl border border-white/10" />
            <div className="bg-modal-dark h-48 rounded-xl border border-white/10" />
            <div className="bg-modal-dark h-48 rounded-xl border border-white/10" />
            <div className="bg-modal-dark h-48 rounded-xl border border-white/10" />
            <div className="bg-modal-dark h-48 rounded-xl border border-white/10" />
            <div className="bg-modal-dark h-48 rounded-xl border border-white/10" />
          </div>
        </div>
      </div>
      {/* Modal Backdrop Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Modal Container */}
        <div className="bg-modal-dark w-full max-w-140 rounded-xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-start justify-between p-6 border-b border-white/5">
            <div className="flex flex-col gap-1">
              <h2 className="text-white text-2xl font-bold leading-tight">
                Add New Product
              </h2>
              <p className="text-[#8fccba] text-sm font-normal">
                Fill in the details to list a new energy asset.
              </p>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {/* Modal Content (Scrollable if needed) */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            {/* Product Name */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-base font-medium">
                Product Name
              </label>
              <input
                className="form-input w-full rounded-xl text-white border border-[#306959] bg-[#18342c] h-14 placeholder:text-[#8fccba]/50 px-4 text-base font-normal outline-none focus:ring-0"
                placeholder="e.g., Solar Panel X-500"
                type="text"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Energy Category */}
              <div className="flex flex-col gap-2">
                <label className="text-white text-base font-medium">
                  Energy Category
                </label>
                <select className="form-input custom-select w-full rounded-xl text-white border border-[#306959] bg-[#18342c] h-14 px-4 text-base font-normal outline-none focus:ring-0">
                  <option disabled selected>
                    Select category
                  </option>
                  <option value="solar">Solar Energy</option>
                  <option value="wind">Wind Energy</option>
                  <option value="battery">Energy Storage</option>
                  <option value="grid">Smart Grid</option>
                </select>
              </div>
              {/* Unit Price */}
              <div className="flex flex-col gap-2">
                <label className="text-white text-base font-medium">
                  Unit Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8fccba]">
                    $
                  </span>
                  <input
                    className="form-input w-full rounded-xl text-white border border-[#306959] bg-[#18342c] h-14 placeholder:text-[#8fccba]/50 pl-8 pr-4 text-base font-normal outline-none focus:ring-0"
                    placeholder="0.0"
                    type="number"
                  />
                </div>
              </div>
            </div>
            {/* Status Selection */}
            <div className="flex flex-col gap-3">
              <label className="text-white text-base font-medium">
                Availability Status
              </label>
              <div className="flex flex-wrap gap-3">
                <label className="flex-1 text-sm font-medium leading-normal flex items-center justify-center rounded-xl border border-[#306959] px-4 h-14 text-white has-checked:border-2 relative cursor-pointer transition-all">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      check_circle
                    </span>
                    Active
                  </div>
                  <input
                    defaultChecked
                    className="invisible absolute"
                    name="status"
                    type="radio"
                  />
                </label>
                <label className="flex-1 text-sm font-medium leading-normal flex items-center justify-center rounded-xl border border-[#306959] px-4 h-14 text-white has-checked:border-2 relative cursor-pointer transition-all">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-white/40 text-[18px]">
                      block
                    </span>
                    Inactive
                  </div>
                  <input
                    className="invisible absolute"
                    name="status"
                    type="radio"
                  />
                </label>
              </div>
            </div>
            {/* Product Image Upload (Simulated Component) */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-base font-medium">
                Product Image
              </label>
              <div className="w-full h-32 border-2 border-dashed border-[#306959] rounded-xl bg-[#18342c]/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#18342c]/50 transition-colors">
                <span className="material-symbols-outlined text-[#8fccba]">
                  cloud_upload
                </span>
                <span className="text-[#8fccba] text-sm">
                  Click or drag image to upload
                </span>
              </div>
            </div>
          </div>
          {/* Modal Footer */}
          <div className="p-6 border-t border-white/5 bg-[#18342c]/20 flex items-center justify-end gap-3">
            <button className="flex min-w-25 cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-transparent text-white border border-white/20 hover:bg-white/5 text-sm font-semibold transition-colors">
              <span>Cancel</span>
            </button>
            <button className="flex min-w-40 cursor-pointer items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary text-[#10221d] text-sm font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(9,246,179,0.2)]">
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Create Product</span>
            </button>
          </div>
        </div>
      </div>
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>
    </>
  );
};

export default AddProduct;
