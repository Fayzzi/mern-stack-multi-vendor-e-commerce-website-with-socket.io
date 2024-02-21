import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TfiGallery } from "react-icons/tfi";
import socketIO from "socket.io-client";
import { format, isThisMonth, isToday, isYesterday } from "date-fns";
import { LazyLoadImage } from "react-lazy-load-image-component";
const Endpoint = "http://localhost:4000/";
const socketId = socketIO(Endpoint, { transports: ["websocket"] });

export default function InboxComp() {
  const [newMessage, setNewMessage] = useState("");
  const [arrivalmessage, setArrivalMessage] = useState(null);
  const [messageDirectory, setMessageDictionary] = useState({});
  const { seller } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [currentChat, setcurrentChat] = useState(null);
  const [currentUserData, setcurrentUserData] = useState([]);
  const [onlineUser, setonlineUser] = useState([]);
  const [status, setStatus] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [conversationLoading, setConversationLoading] = useState(true);
  const scrollRef = useRef();
  console.log("messageDirectory:", messageDirectory);
  //scroller
  useEffect(() => {
    open &&
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [messageDirectory, open]);

  //setting user online status
  useEffect(() => {
    socketId.emit("addUser", seller?._id);
    socketId.on("getAllUsers", (data) => setonlineUser(data));
  }, [seller, status]);
  const onlineStatus = (chat) => {
    const otherUser = chat.members.find((u) => u !== seller?._id);
    const onlineUseravailable =
      onlineUser && onlineUser.find((u) => u.userId === otherUser);
    return onlineUseravailable ? true : false;
  };
  useEffect(() => {
    setStatus(status);
  }, [status, setStatus]);
  console.log(status);
  //getting all conversations
  useEffect(() => {
    axios
      .get("/api/v2/conversation/get-seller-conversation/" + seller._id)
      .then((response) => {
        setConversations(response.data.allConversations);
        setConversationLoading(false);
      })
      .catch((e) => {
        console.log(e.response.data.message);
      });
  }, [seller, messageDirectory]);
  //getting all messages related to converationn
  useEffect(() => {
    if (currentChat && open) {
      axios
        .get("/api/v2/singlemessage/get-all-messages/" + currentChat?._id)
        .then((response) => {
          setMessageDictionary((prev) => ({
            ...prev,
            [currentChat?._id]: response.data.allmessages,
          }));
        })
        .catch((e) => console.log(e.message));
    }
  }, [seller, messageDirectory, open, currentChat]);
  //new Message handler
  const messageHandeler = async (e) => {
    e.preventDefault();
    if (currentChat) {
      const recieverId = currentChat?.members.find((d) => d !== seller?._id);
      socketId.emit("sendMessage", {
        senderId: seller?._id,
        text: newMessage,
        recieverId,
      });
      try {
        if (newMessage !== "") {
          await axios
            .post("/api/v2/singlemessage/create-new-message", {
              sender: seller?._id,
              text: newMessage,
              conversationId: currentChat._id,
            })
            .then((response) => {
              setMessageDictionary((prev) => ({
                ...prev,
                [currentChat?._id]: [
                  ...(prev[currentChat?._id] || []),
                  response.data.newMessage,
                ],
              }));
              updateLastMesage();
              setNewMessage("");
            })
            .catch((e) => console.log(e));
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };
  const imageHandeler = (e) => {
    e.preventDefault();
    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    const formData = new FormData();
    const allFiles = e.target.files;
    for (let i = 0; i < allFiles.length; i++) {
      formData.append("images", allFiles[i]);
    }
    formData.append("conversationId", currentChat?._id);
    formData.append("text", "");

    formData.append("sender", seller?._id);
    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: allFiles,
    });
    axios
      .post("/api/v2/singlemessage/create-new-message", formData)
      .then((response) => {
        setMessageDictionary((prevDictionary) => ({
          ...prevDictionary,
          [currentChat._id]: [
            ...(prevDictionary[currentChat._id] || []),
            response.data.newMessage,
          ],
        }));
        updateLastMesageforImage();
      });
  };
  const updateLastMesageforImage = () => {
    axios
      .put("/api/v2/conversation/update-last-conversation/" + currentChat._id, {
        lastMessage: "Photo",
        lastMessageId: seller?._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  //getting upcomming message
  useEffect(() => {
    socketId.on("newMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        images: data.images ? data.images : null,
        createdAt: data.createdAt,
      });
    });
  }, [messageDirectory]);
  useEffect(() => {
    arrivalmessage &&
      currentChat?.members.includes(arrivalmessage.sender) &&
      setMessageDictionary((prev) => ({
        ...prev,
        [currentChat?._id]: [...(prev[currentChat?._id] || []), arrivalmessage],
      }));
  }, [currentChat, arrivalmessage]);
  //popstate
  useEffect(() => {
    const onPopstate = () => {
      setOpen(false);
      setMessageDictionary({});
    };
    window.addEventListener("popstate", onPopstate);
    return () => window.removeEventListener("popstate", onPopstate);
  }, []);
  //upadting lastMessage in coversation database
  const updateLastMesage = () => {
    socketId.emit("updateLastmessage", {
      lastMessage: newMessage,
      lastmessageid: seller?._id,
    });

    axios
      .put("/api/v2/conversation/update-last-conversation/" + currentChat._id, {
        lastMessage: newMessage,
        lastMessageId: seller?._id,
      })
      .then((res) => {
        setNewMessage("");
      })
      .catch((e) => {
        console.log(e.message);
      });
  };
  return (
    <div className="h-[90vh] w-full p-4 bg-white rounded-md">
      {!open ? (
        <>
          <h1 className="text-[23px] font-semibold text-center my-4">
            All Messages
          </h1>
          {conversationLoading ? (
            <div>...Loading</div>
          ) : (
            conversations &&
            conversations.map((c, i) => (
              <ConversationList
                conData={c}
                user={seller}
                setOpen={setOpen}
                setcurrentChat={setcurrentChat}
                key={i}
                online={onlineStatus(c)}
                setStatus={setStatus}
                status={status}
                setcurrentUserData={setcurrentUserData}
              />
            ))
          )}
        </>
      ) : null}
      {open && (
        <AllMessages
          user={seller}
          status={onlineStatus(currentChat)}
          userData={currentUserData}
          messages={messageDirectory[currentChat?._id]}
          setStatus={setStatus}
          scrollRef={scrollRef}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          messageHandeler={messageHandeler}
          imageHandeler={imageHandeler}
        />
      )}
    </div>
  );
}
const ConversationList = ({
  conData,
  setcurrentUserData,
  setOpen,
  online,
  user,
  setcurrentChat,
  setStatus,
  status,
}) => {
  const [singleUer, getSingleUser] = useState([]);
  const navigate = useNavigate();
  //getting user data from database
  const userId = conData?.members?.find((u) => u !== user?._id);
  useEffect(() => {
    setStatus(online);
    try {
      axios
        .get("/api/v2/user/get-user-data/" + userId)
        .then((response) => getSingleUser(response.data.userData));
    } catch (e) {
      console.log(e);
    }
  }, [userId, setStatus, status, online]);
  //navigation
  const handleNavigation = (data) => {
    navigate("/dashboard-messages?" + data?._id);
  };

  return (
    <div
      onClick={(e) =>
        setcurrentChat(conData) ||
        setOpen(true) ||
        handleNavigation(conData) ||
        setcurrentUserData(singleUer) ||
        setStatus(online)
      }
      className=" bg-gray-300 flex gap-2 rounded-md p-2 my-2 bg-opacity-50 cursor-pointer"
    >
      <div className="w-fit relative">
        <img
          loading="lazy"
          className="w-[50px] h-[50px] rounded-full object-cover"
          src={`http://localhost:3000/${singleUer?.avatar}`}
          alt=""
        />
        <div
          className={`h-[15px] w-[15px] rounded-full absolute top-0 right-0 ${
            online ? "bg-green-500" : "bg-gray-500"
          }`}
        />
      </div>
      <div>
        <h1 className="text-[18px] font-[600]">{singleUer?.name}</h1>
        <h1 className="text-[14px] font-extralight">
          {conData?.lastMessage?.length > 50
            ? conData?.lastMessage.slice(0, 50) + "..."
            : conData?.lastMessage}
        </h1>
      </div>
    </div>
  );
};
const AllMessages = ({
  newMessage,
  messageHandeler,
  setNewMessage,
  scrollRef,
  status,
  setStatus,
  messages,
  user,
  userData,
  imageHandeler,
}) => {
  return (
    <div className=" flex flex-col h-[90vh] w-[80vw]  justify-between">
      <div className="flex p-2 bg-green-200 rounded-md  gap-2">
        <img
          loading="lazy"
          className="w-[50px] h-[50px] rounded-full object-cover"
          src={`http://localhost:3000/${userData?.avatar}`}
          alt=""
        />
        <div>
          <h1 className="text-[17px] font-semibold">{userData?.name}</h1>
          <h1 className="text-[13px]">{status ? "Online" : "Offline"}</h1>
        </div>
      </div>
      <div className="h-[80vh] overflow-x-scroll  p-2 border-l border-r ">
        {messages &&
          messages.map((item, i) => (
            <div
              ref={scrollRef}
              key={i}
              className={`w-full flex ${
                item?.sender === user._id ? "justify-end" : "justify-start"
              }`}
            >
              {item?.sender !== user?._id && (
                <div className="">
                  <LazyLoadImage
                    className="rounded-full h-[30px]  min-w-[30px] shrink-0 object-cover"
                    src={`http://localhost:3000/` + userData?.avatar}
                  />
                </div>
              )}
              <div className="flex overflow-x-scroll ">
                {item.images &&
                  item.images.map((ima, i) => (
                    <LazyLoadImage
                      key={i}
                      effect="opacity"
                      className={`h-[250px] border rounded 
                       shadow cursor-pointer m-3 min-w-[200px] transition-all ease-in-out duration-500 object-contain shrink-0`}
                      src={`http://localhost:3000/` + ima}
                    />
                  ))}
              </div>

              {item.text !== "" && (
                <div
                  className={`text-white ml-1 w-max rounded-md my-2 h-max p-2 relative ${
                    item?.sender === user._id ? "bg-[#000008]" : "bg-[#23db73]"
                  } `}
                >
                  <h1 className="text-[18px] ">{item?.text}</h1>
                  <h1
                    className={`text-[11px] ${
                      item?.sender === user._id
                        ? "text-gray-400"
                        : "text-gray-600"
                    }   `}
                  >
                    {item?.createdAt && (
                      <>
                        {isToday(item?.createdAt) && (
                          <span>
                            Today at:{" "}
                            {format(new Date(item?.createdAt), "hh:mm a")}
                          </span>
                        )}
                        {isYesterday(item?.createdAt) && (
                          <span>
                            Yesterday at:{" "}
                            {format(new Date(item?.createdAt), "hh:mm a")}
                          </span>
                        )}
                        {!isToday(item?.createdAt) &&
                          !isYesterday(item?.createdAt) &&
                          isThisMonth(item?.createdAt) && (
                            <span>
                              {" "}
                              {format(new Date(item?.createdAt), "dd-MM p")}
                            </span>
                          )}
                      </>
                    )}
                  </h1>
                </div>
              )}
            </div>
          ))}
      </div>
      <div>
        <form
          onSubmit={messageHandeler}
          action=""
          className="p-2 flex justify-between items-center"
        >
          <div className="w-[5%]">
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              multiple
              onChange={imageHandeler}
              id="file-new"
              className="hidden w-full h-full"
            />
            <label htmlFor="file-new">
              <TfiGallery size={20} className="cursor-pointer" />
            </label>
          </div>
          <div className="flex relative w-[95%] ">
            <input
              type="text"
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter Your message"
              className="p-2 border relative w-full rounded "
              name=""
              id=""
            />

            <AiOutlineSend
              size={25}
              onClick={messageHandeler}
              className="absolute cursor-pointer top-2 right-2"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
