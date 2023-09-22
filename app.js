const { ref, reactive, watch, watchEffect, onMounted, createApp } = Vue;

const app = createApp({
  setup() {
    let loadNotes = reactive(JSON.parse(localStorage.getItem("notes")) || []);
    const title = ref("");
    const text = ref("");
    const selectedNote = ref(null);
    //規則
    const copyrightTime = ref(new Date().getFullYear());
    const maxlength = ref(200);
    const placeholder = ref("請輸入標題");
    //選擇的筆記
    const selectNote = (data) => {
      selectedNote.value = data;
    };
    const btn_delete = (data) => {
      try {
        const index = data.id;
        const del_id = loadNotes.findIndex((note) => note.id === index);
        if (index === 0) {
          //選擇第一項僅清空
          title.value = loadNotes[0].title = "";
          text.value = loadNotes[0].content = "";
          selectedNote.value = loadNotes[0];

          return;
        }
        loadNotes.splice(del_id, 1);

        //刪除完畢跳轉到第一項
        text.value = loadNotes[0].content;
        title.value = loadNotes[0].title;
        selectedNote.value = loadNotes[0];
      } catch (err) {}
    };

    //添加新的一筆筆記
    const add = () => {
      const newNote = {
        id: new Date().getTime(),
        title: `new note${loadNotes.length + 1}`,
        content: "",
      };

      loadNotes.push(newNote);
      localStorage.setItem("notes", JSON.stringify(loadNotes));

      //自動跳轉到新筆記
      selectedNote.value = loadNotes[loadNotes.length - 1];
      title.value = loadNotes[loadNotes.length - 1].title;
      text.value = loadNotes[loadNotes.length - 1].content;
    };
    //全部清除
    const del = () => {
      loadNotes = reactive(localStorage.removeItem("notes"));
      location.reload();
    };
    //將選擇內容放入頁面輸入框
    watch(selectedNote, (newSelected, oldSelected) => {
      if (newSelected) {
        title.value = newSelected.title;
        text.value = newSelected.content;
      }
    });

    //點入應用默認
    onMounted(() => {
      //初始化
      if (loadNotes.length === 0) {
        const initNote = {
          id: 0,
          title: `new note${loadNotes.length + 1}`,
          content: "",
        };
        loadNotes.push(initNote);
        localStorage.setItem("notes", JSON.stringify(initNote));
      }
      if (!selectedNote.value) {
        text.value = loadNotes[0].content;
        title.value = loadNotes[0].title;
        selectedNote.value = loadNotes[0];
      }
    });
    watchEffect(() => {
      //localStorage update
      if (selectedNote.value) {
        //找到更新id
        const index = loadNotes.findIndex(
          (note) => note.id === selectedNote.value.id
        );
        loadNotes[index].id = selectedNote.value.id;
        loadNotes[index].title = title.value;
        loadNotes[index].content = text.value;
        localStorage.setItem("notes", JSON.stringify(loadNotes));
      }
    });

    return {
      copyrightTime,
      title,
      text,
      add,
      del,
      loadNotes,
      selectNote,
      btn_delete,
      maxlength,
      placeholder,
    };
  },
});
app.mount("#app");
