$(() => {
    const addBtn = $('#addBtn');
    console.log(addBtn);
    const emailsArea = $('#emails');
    const options = $('.options');
    const moptions = $('.options2');

    let studentsG = [];

    const updateForm = function(students) {
        for(let i=0 ; i<options.length ; i++) {
            for(let j=0 ; j<students.length ; j++) {
                email = students[j].email;
                console.log(email);
                let opt = document.createElement('option');
                opt.value = email + ';' + students[j]._id + ';' + students[j].phoneNo;
                opt.innerHTML = email
                options[i].appendChild(opt);
            }
        }
    };

    const updateForm2 = function(mentors) {
        for(let j=0 ; j<mentors.length ; j++) {
            email = mentors[j].email;
            console.log(email);
            let opt = document.createElement('option');
            opt.value = email + ';' + mentors[j]._id + ';' + mentors[j].phoneNo;
            opt.innerHTML = email
            moptions[0].appendChild(opt);
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

    $.get('/api/students/2')
    .then(mentors => {
        console.log("Mentors aagye");
        updateForm2(mentors);
        $.get('/api/students/1')
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
    .catch(err => {
        console.log(err);
    }) 
})