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
    // setText(searchText + tag + ' ');
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    alert("Your link has been copied!");
  };

  useEffect(() => {
    findLocation(searchText);
  }, [searchText]);

  return (
    <div className="flex flex-col box-border justify-center items-center m-3 p-3 gap-5">
      <h1 className="w-full text-center text-[4.5rem] font-bold">
        เที่ยวไหนดี
      </h1>
      <div className="flex flex-col w-[75%]">
        <label className="flex flex-col w-full gap-2">
          ค้นหาที่เที่ยว
        </label>
        <input
              className="text-center p-3 border-b-2 border-transperant shadow-lg hover:shadow-sky-200"
              type="text"
              value={searchText}
              placeholder="หาที่เที่ยวแล้วไปกัน ..."
              onChange={(e) => {
                setText(e.target.value);
              }}
        />
      </div>

      {location.map((place) => {
        return (
          <div
            className="flex flex-col lg:flex-row w-full h-fit box-border gap-5 m-2"
            key={place.eid}
          >
            <div className="flex w-full lg:w-2/5 justify-center">
              <img src={place.photos[0]} className="rounded-3xl w-[25rem] h-[20rem] object-cover "/>
            </div>
            <div className="flex w-full lg:w-3/5 flex-col h-fit gap-2">
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
                        className="flex rounded-3xl w-[7rem] h-[6rem] hover:w-[9rem] hover:h-[7rem] hover:duration-500"
                        src={photo}
                      />
                    </div>
                  );
                })}
              </div>
              <button
                className="self-end bg-sky-400 p-3 mr-5 w-fit h-fit text-white rounded-full hover:scale-[1.1] hover:shadow-xl hover:shadow-sky-200"
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
