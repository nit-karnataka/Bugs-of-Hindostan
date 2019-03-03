$(() => {
    const addBtn = $('#addBtn');
    console.log(addBtn);
    const emailsArea = $('#emails');
    const options = $('.options');

    let studentsG = [];

    const updateForm = function(students) {
        for(let i=0 ; i<options.length ; i++) {
            for(let j=0 ; j<students.length ; j++) {
                email = students[j].email;
                console.log(email);
                let opt = document.createElement('option');
                opt.value = email
                opt.innerHTML = email
                options[i].appendChild(opt);
            }
        }
    };

    $('#addBtn').click(() => {
        appendData = '<div class="form-group"> ' + 
        ' <p> Select User </p> ' + 
        '<select class="options" name="studentEmail[]">' +
            '<option value="None">No User</option> ';
        for(let i=0 ; i<studentsG.length ; i++) {
            appendData = appendData + '<option value="' + studentsG[i].email + '">' + studentsG[i].email + '</option>'
        }
        appendData = appendData +  '</select> ' +          
        ' </div> ';
        emailsArea.append(appendData)
    })

    $.get('/api/students')
    .then(students => {
        console.log("Students aagye");
        console.log(students);
        studentsG = students
        console.log("Students g");
        console.log(studentsG);
        updateForm(studentsG);
    })
    .catch(err => {
        console.log(err);
    }) 
})