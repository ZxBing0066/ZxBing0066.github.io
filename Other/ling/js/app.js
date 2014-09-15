$('#select ul').html(_.template('<%_.each(questions, function(question,index){%> <li index=<%=index%>><%=question.title%></li> <%})%>')({questions:questions}))

$('#select ul li').click(function() {
	var index = $(this).attr('index');
	if (index == $('#questions').attr('index')) {
		return;
	}
	$('#questions').attr('index', index);
	$(this).parent().find('.select').removeClass('select');
	$(this).addClass('select');
	render(index);
	$('#questions .singleChoice .choices>span').click(function(e) {
		$(this).parent().find('.select').removeClass('select');
		$(this).addClass('select');
	})
	$('#questions .multipleChoice .choices>span').click(function(e) {
		$(this).toggleClass('select');
	})
})
$('#showAnswerBtn').click(showAnswer);
$('#retestBtn').click(retest);

function render(index) {
	$('#questions')[0].scrollTop = 0;
	$('#questions>div').html(_.template("<h2><%=data.title%></h2>\
		<%var letterArr = ['A', 'B', 'C', 'D', 'E', 'F']%>\
		<%if(data.singleChoiceQ&&data.singleChoiceQ.length>0){%>\
			<h4>单选题</h4>\
			<ul class='singleChoice'>\
			<%_.each(data.singleChoiceQ, function(question){%>\
				<%if (question.a&&question.a.length>0) {%>\
					<li data-answer=<%=question.a%>>\
				<%} else {%>\
					<li>\
				<%}%>\
				<p><%=question.q%></p>\
				<div class='choices'>\
				<%_.each(question.c, function(choice, index){%>\
					<span><%=letterArr[index]%>、<%=choice%></span>\
				<%})%>\
				</div>\
				<%if (question.a&&question.a.length>0) {%>\
					<span class='answer'><%=question.a%></span>\
				<%} else {%>\
					<span class='answer'>未录入答案</span>\
				<%}%>\
				</li>\
			<%})%>\
			</ul>\
		<%}%>\
		<%if(data.multipleChoiceQ&&data.multipleChoiceQ.length>0){%>\
			<h4>多选题</h4>\
			<ul class='multipleChoice'>\
			<%_.each(data.multipleChoiceQ, function(question){%>\
				<%if (question.a&&question.a.length>0) {%>\
					<li data-answer=<%=question.a%>>\
				<%} else {%>\
					<li>\
				<%}%>\
				<p><%=question.q%></p>\
				<div class='choices'>\
				<%_.each(question.c, function(choice, index){%>\
					<span><%=letterArr[index]%>、<%=choice%></span>\
				<%})%>\
				</div>\
				<%if (question.a&&question.a.length>0) {%>\
					<span class='answer'><%=question.a%></span>\
				<%} else {%>\
					<span class='answer'>未录入答案</span>\
				<%}%>\
				</li>\
				<%})%>\
			</ul>\
		<%}%>")({
		data: questions[index]
	}));
}

function showAnswer() {
	$('.singleChoice li, .multipleChoice li').removeClass();
	_.each($('.singleChoice li, .multipleChoice li'), function(li) {
		var rightAnswer = $(li).data('answer');
		if (rightAnswer == null || rightAnswer.length < 1) {
			$(li).addClass('error');
			return
		}
		var yourAnswer = '';
		var letterArr = ['A', 'B', 'C', 'D', 'E', 'F'];
		_.each($(li).find('.choices .select'), function(select) {
			yourAnswer += letterArr[$(select).index()];
		})
		if (yourAnswer.length == rightAnswer.length) {
			yourAnswer = yourAnswer.split('');
			var right = _.every(yourAnswer, function(answer) {
				return rightAnswer.search(answer) > -1
			})
			if (right) {
				$(li).addClass('right');
				return
			}
		}
		$(li).addClass('wrong');
	})
	$('#questions .answer').show();
}

function retest() {
	var index = $('#questions').attr('index');
	if(index == null) {
		return;
	}
	render(index);
}