import { useState, useEffect } from "react";
import axios from "axios";

function HomePage() {
  const [searchText, setText] = useState("");
  const [location, setLocation] = useState([]);

  const limitedText = (text, maxlength) => {
    const cutText =
      text.length > maxlength ? text.slice(0, maxlength) + "..." : text;
    return (
      <p className="overflow-hidden text-ellipsis whitespace-nowrap w-full text-[1.1rem]">
        {cutText}
      </p>
    );
  };

  const findLocation = async (text) => {
    try {
      const result = await axios.get(
        `http://localhost:4001/trips?keywords=${text}`
      );
      setLocation(result.data.data);
    } catch (error) {
      console.error("Fail to Load.");
    }
  };

  const handleAddTag = (tag) => {
    const newText = searchText ? `${searchText} ${tag}` : tag;
    setText(newText);
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    alert("Your link has been copied!");
  };

  useEffect(() => {
    findLocation(searchText);
  }, [searchText]);

  return (
    <div className="flex flex-col box-border justify-center items-center m-10 p-10 gap-5">
      <h1 className="w-full text-center text-[4.5rem] font-bold">
        เที่ยวไหนดี
      </h1>
      <label className="flex flex-col w-full justify-center items-center gap-2">
        <span className="self-start text-[1.2rem]">ค้นหาที่เที่ยว</span>
        <div className="flex flex-row w-full justify-between items-center gap-10">
          <input
            className="text-center w-full p-3 border-b-2 border-transperant shadow-lg hover:shadow-sky-200"
            type="text"
            value={searchText}
            placeholder="หาที่เที่ยวแล้วไปกัน ..."
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </div>
      </label>
      {location.map((place) => {
        return (
          <div
            className="flex max-md:flex-col md:flex-row w-full h-fit box-border gap-10 m-10"
            key={place.eid}
          >
            <div className="flex max-md:w-full max-lg:w-1/2 max-lg:h-2/3 lg:w-1/2">
              <img src={place.photos[0]} className="rounded-3xl" />
            </div>
            <div className="flex flex-col max-md:w-full max-lg:w-1/2 lg:w-1/2 justify-start gap-2">
              <a
                href={place.url}
                target="_blank"
                rel="noopener noreferer"
                className="text-black font-bold w-fit text-[1.75rem] hover:underline hover:scale-[1.05] hover:transition hover:duration-300"
              >
                {place.title}
              </a>
              {limitedText(place.description, 100)}
              <a
                href={place.url}
                target="_blank"
                rel="noopener noreferer"
                className="text-sky-400 underline w-fit h-fit p-1 pl-0 hover:text-black hover:bg-sky-200 hover:rounded-full hover:transition hover:duration-300"
              >
                อ่านต่อ
              </a>
              <div className="flex flex-row items-center gap-1 w-full text-sm">
                หมวด{" "}
                {place.tags.map((tag, index) => {
                  if (index == place.tags.length - 1) return null;
                  return (
                    <div key={index}>
                      <button
                        className="underline p-1 hover:bg-sky-200 hover:rounded-full text-sm"
                        onClick={() => {
                          handleAddTag(tag);
                        }}
                      >
                        {tag}
                      </button>
                    </div>
                  );
                })}
                <p>และ</p>
                {place.tags.map((tag, index) => {
                  if (index != place.tags.length - 1) return null;
                  return (
                    <div key={index}>
                      <button
                        className="underline p-1 hover:bg-sky-200 hover:rounded-full text-sm"
                        onClick={() => {
                          handleAddTag(tag);
                        }}
                      >
                        {tag}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-row gap-5 w-full">
                {place.photos.map((photo, index) => {
                  if (index == 0) return null;
                  return (
                    <div key={index}>
                      <img
                        className="flex rounded-3xl w-[9rem] h-[8rem] hover:w-[15rem] hover:h-[12rem] hover:ease-in-out hover:duration-500"
                        src={photo}
                      />
                    </div>
                  );
                })}
              </div>
              <button
                className="self-end bg-sky-400 p-3 w-fit h-fit text-white rounded-full hover:scale-[1.1] hover:shadow-xl hover:shadow-sky-200"
                onClick={() => {
                  handleCopy(place.url);
                }}
              >
                Copy
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HomePage;
