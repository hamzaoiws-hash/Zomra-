const SUPABASE_URL = "https://kslhcxgfifjfuhxaxvws.supabase.co";
const SUPABASE_KEY = "sb_publishable_HRpnAdrYRHk7xO8mvY9zEA_TDJQuZjW";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;
let currentProfile = null;
let allProfiles = [];
let activeChatUser = null;
let chatChannel = null;
let selectedPostFile = null;
let feedFilter = 'all';
let activeGroup = null;
let groupChannel = null;
let feedOffset = 0;
const FEED_PAGE_SIZE = 12;
let reelsObserver = null;
let viewingProfile = null;
let globalMsgChannel = null;
let profileSubTab = 'posts';
let currentQuestionId = null;
let activeProject = null;
let blockedIds = [];

const notificationSound = new Audio('data:audio/wav;base64,UklGRl9AAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YTtAAAB/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/');

/* ============================================================
   الترجمة
   ============================================================ */
const translations = {
  ar: {
    tagline: 'المكان بتاع الطلاب', email: 'الإيميل', password: 'الباسورد', login: 'دخول',
    noAccount: 'مفيش حساب؟', createOne: 'اعمل واحد', username: 'اسم المستخدم',
    createAccount: 'إنشاء حساب', haveAccount: 'عندك حساب؟', hi: 'أهلاً',
    logout: 'خروج', feed: 'الفيد', library: 'المكتبة', groups: 'مجموعات', projects: 'مشاريع',
    chat: 'الشات', qa: 'أسئلة', profile: 'بروفايلي', searchPlaceholder: '🔍 دور على مستخدم أو منشور...',
    all: 'الكل', following: 'اللي بتتابعهم', whatsNew: 'عندك إيه جديد؟', addPhoto: '📷 إضافة صورة',
    post: 'نشر', loadMore: 'حمّل المزيد', summaries: '📄 ملخصات', reels: '🎬 ريلز',
    allSubjects: 'كل المواد', newest: 'الأحدث', mostLiked: 'الأكثر إعجابًا', summaryTitle: 'عنوان الملخص',
    subjectExample: 'المادة (مثلاً: رياضيات)', gradeOptional: 'السنة الدراسية (اختياري)',
    elementary: 'ابتدائي', middle: 'إعدادي', high: 'ثانوي', university: 'جامعة',
    chooseFile: '📎 اختيار ملف (PDF أو صورة)', uploadSummary: 'رفع الملخص', uploadReelHint: 'ارفع ريل جديد من هنا:',
    reelCaption: 'اكتب وصف للريل...', chooseVideo: '🎥 اختيار فيديو', uploadReel: 'رفع الريل',
    openReels: '▶️ فتح الريلز', groupName: 'اسم المجموعة', subject: 'المادة', createGroup: 'إنشاء مجموعة',
    backToGroups: '⬅ رجوع للمجموعات', messageGroup: 'اكتب رسالة للمجموعة...', send: 'إرسال',
    projectName: 'اسم المشروع', createProject: 'إنشاء مشروع', backToProjects: '⬅ رجوع للمشاريع',
    newTask: 'مهمة جديدة', addTask: 'إضافة مهمة', pickSomeone: 'اختار حد تتكلم معاه',
    typeMessage: 'اكتب رسالة...', weeklyChallenge: '🏆 التحدي الأسبوعي', newChallengeTitle: 'عنوان تحدي جديد',
    challengeDesc: 'وصف التحدي', postChallenge: 'نشر تحدي', questionTitle: 'عنوان السؤال',
    subjectOptional: 'المادة (اختياري)', questionDetails: 'تفاصيل السؤال...', ask: 'اسأل',
    leaderboard: '🥇 لوحة المتصدرين', backToQuestions: '⬅ رجوع للأسئلة', writeAnswer: 'اكتب إجابتك...',
    submitAnswer: 'إرسال الإجابة', changePhoto: 'تغيير صورة البروفايل', post_: 'منشور',
    followers: 'متابعين', following_: 'متابَعون', noBio: 'لسه معملتش بايو', editBio: 'تعديل البايو',
    myPosts: 'منشوراتي', saved: 'المحفوظات', discoverStudents: 'طلاب تقدر تتابعهم',
    accountSettings: 'إعدادات الحساب', appTheme: 'لون التطبيق', applyColor: 'تطبيق',
    fontSize: 'حجم الخط', small: 'صغير', medium: 'متوسط', large: 'كبير', profilePrivacy: 'خصوصية البروفايل',
    visibleAll: 'يشوفه أي حد', visibleFollowers: 'المتابعين بس', visibleNone: 'محدش (خاص)',
    notifications: 'الإشعارات', notifLikes: 'لايكات على منشوراتي', notifComments: 'تعليقات على منشوراتي',
    notifFollows: 'متابعين جدد', favSubjects: 'موادك المفضلة (افصل بفاصلة)', favSubjectsExample: 'مثلاً: رياضيات، فيزياء',
    saveSubjects: 'حفظ المواد', examFreeze: '🎓 تجميد الحساب وقت الامتحانات',
    examFreezeDesc: 'هيتم تجميد الإشعارات والرسائل الواردة لحد التاريخ ده، وهيرجع طبيعي أوتوماتيك.',
    freezeUntil: 'تجميد لحد التاريخ ده', unfreezeNow: 'إلغاء التجميد دلوقتي', newUsername: 'اسم مستخدم جديد',
    enterNewUsername: 'اكتب اسم مستخدم جديد', updateUsername: 'تحديث اسم المستخدم', newPassword: 'باسورد جديد',
    min6chars: '6 حروف على الأقل', updatePassword: 'تحديث الباسورد', blockedUsers: 'المستخدمين المحظورين',
    exportData: '📦 تصدير بياناتي (JSON)', deactivateAccount: '⏸ تعطيل الحساب مؤقتًا',
    deleteData: '🗑 حذف بياناتي نهائيًا', close: 'إغلاق',
    fillAllFields: 'من فضلك املأ كل الحقول', usernameTaken: 'اسم المستخدم ده مستخدم قبل كده',
    wrongCreds: 'الإيميل أو الباسورد غلط', accountDeactivatedConfirm: 'حسابك معطّل مؤقتًا. عايز تفعّله تاني؟',
    newMessageFrom: 'رسالة من', newMessage: 'رسالة جديدة',
    likedYourPost: 'عمل لايك على منشورك', commentedOnPost: 'علّق على منشورك', startedFollowing: 'بدأ يتابعك',
    noNotifsYet: 'مفيش إشعارات لسه', enterUsername: 'اكتب اسم مستخدم', usernameUpdated: 'تم تحديث اسم المستخدم بنجاح',
    passwordTooShort: 'الباسورد لازم يكون 6 حروف على الأقل', passwordUpdated: 'تم تحديث الباسورد بنجاح',
    subjectsSaved: 'تم حفظ المواد المفضلة', pickEndDate: 'اختار تاريخ انتهاء الأول', pickFutureDate: 'اختار تاريخ في المستقبل',
    examModeOn: 'وضع الامتحانات شغال لحد', examModeOff: 'تم إلغاء وضع الامتحانات', notFrozen: 'مش متجمد دلوقتي',
    frozenUntil: 'متجمد لحد', noResults: 'مفيش نتائج', noBookmarksYet: 'لسه ما حفظتش أي منشور',
    confirmBlock: 'متأكد إنك عايز تحظر المستخدم ده؟', noBlockedUsers: 'مفيش حد محظور', unblock: 'إلغاء الحظر',
    confirmDeactivate: 'هيتم تعطيل حسابك مؤقتًا لحد ما تسجل دخول تاني. متأكد؟', confirmDeleteData1: 'تحذير: هيتم حذف كل بوستاتك وملخصاتك نهائيًا. متأكد تمامًا؟',
    confirmDeleteData2: 'تأكيد أخير: مفيش رجوع بعد كده، متأكد؟', dataDeleted: 'تم حذف بياناتك. هيتم تسجيل خروجك الآن.',
    notFollowingAnyone: 'إنت لسه مش بتتابع حد', feedError: 'حصل خطأ في تحميل الفيد', noPostsYet: 'لسه مفيش بوستات هنا',
    writeSomethingFirst: 'اكتب حاجة أو ضيف صورة الأول', posting: 'جاري النشر...', postError: 'حصل خطأ أثناء النشر: ',
    noComments: 'مفيش تعليقات لسه', writeComment: 'اكتب تعليق...', confirmDeleteComment: 'متأكد إنك عايز تحذف التعليق ده؟',
    confirmDeletePost: 'متأكد إنك عايز تحذف البوست ده؟', couldNotDelete: 'مقدرتش أحذف: ',
    delete: 'حذف', edit: 'تعديل', save: 'حفظ', enterTitleAndFile: 'اكتب عنوان واختار ملف',
    uploading: 'جاري الرفع...', noSummariesYet: 'لسه مفيش ملخصات، ارفع إنت الأول', openFile: 'فتح الملف',
    chooseVideoFirst: 'اختار فيديو الأول', noReelsYet: 'لسه مفيش ريلز، ارفع إنت الأول',
    confirmDeleteReel: 'متأكد إنك عايز تحذف الريل ده؟', enterGroupName: 'اكتب اسم المجموعة',
    noGroupsYet: 'مفيش مجموعات لسه، اعمل إنت الأول', openChat: 'فتح الشات', join: 'انضمام',
    enterProjectName: 'اكتب اسم المشروع', noProjectsYet: 'مفيش مشاريع لسه، اعمل إنت الأول', openProject: 'فتح المشروع',
    noTasksYet: 'مفيش مهام لسه', tasksDone: 'مهمة مكتملة', of: 'من', followBtn: 'متابعة', followingBtn: 'متابَع',
    noOtherStudents: 'مفيش طلاب تانيين لسه', writeBio: 'اكتب البايو بتاعك:', bioUpdateError: 'مقدرتش أحدث البايو: ',
    photoUploadError: 'مقدرتش أرفع الصورة: ', noActiveChallenge: 'مفيش تحدي نشط دلوقتي', by: 'بواسطة',
    enterChallengeTitle: 'اكتب عنوان للتحدي', enterQuestionTitle: 'اكتب عنوان السؤال', noQuestionsYet: 'لسه مفيش أسئلة، اسأل إنت الأول',
    resolved: '✔ متجاوَبة', answers: 'إجابة', noAnswersYet: 'لسه مفيش إجابات', bestAnswer: '✔ الحل المعتمد',
    markBest: 'تحديد كحل معتمد', noLeaderboardData: 'مفيش بيانات لسه', points: 'نقطة',
    noOtherUsers: 'مفيش مستخدمين تانيين لسه', confirmDeleteMsg: 'متأكد إنك عايز تحذف الرسالة دي؟',
    userFrozenMsg: 'المستخدم ده في وضع الامتحانات ومش بيستقبل رسائل دلوقتي.', couldNotSend: 'مقدرتش أبعت الرسالة: ',
    blockUserLabel: 'حظر المستخدم', peopleYouMayKnow: 'أصحاب أصحابك',
    now: 'الآن', minAgo: 'د', hourAgo: 'س', dayAgo: 'يوم'
  },
  en: {
    tagline: 'Made for Students', email: 'Email', password: 'Password', login: 'Log In',
    noAccount: 'No account?', createOne: 'Sign up', username: 'Username',
    createAccount: 'Create Account', haveAccount: 'Have an account?', hi: 'Hi,',
    logout: 'Log Out', feed: 'Feed', library: 'Library', groups: 'Groups', projects: 'Projects',
    chat: 'Chat', qa: 'Q&A', profile: 'Profile', searchPlaceholder: '🔍 Search users or posts...',
    all: 'All', following: 'Following', whatsNew: "What's on your mind?", addPhoto: '📷 Add Photo',
    post: 'Post', loadMore: 'Load More', summaries: '📄 Summaries', reels: '🎬 Reels',
    allSubjects: 'All Subjects', newest: 'Newest', mostLiked: 'Most Liked', summaryTitle: 'Summary title',
    subjectExample: 'Subject (e.g. Math)', gradeOptional: 'Grade level (optional)',
    elementary: 'Elementary', middle: 'Middle School', high: 'High School', university: 'University',
    chooseFile: '📎 Choose file (PDF or image)', uploadSummary: 'Upload Summary', uploadReelHint: 'Upload a new reel here:',
    reelCaption: 'Write a caption...', chooseVideo: '🎥 Choose video', uploadReel: 'Upload Reel',
    openReels: '▶️ Open Reels', groupName: 'Group name', subject: 'Subject', createGroup: 'Create Group',
    backToGroups: '⬅ Back to Groups', messageGroup: 'Message the group...', send: 'Send',
    projectName: 'Project name', createProject: 'Create Project', backToProjects: '⬅ Back to Projects',
    newTask: 'New task', addTask: 'Add Task', pickSomeone: 'Pick someone to chat with',
    typeMessage: 'Type a message...', weeklyChallenge: '🏆 Weekly Challenge', newChallengeTitle: 'New challenge title',
    challengeDesc: 'Challenge description', postChallenge: 'Post Challenge', questionTitle: 'Question title',
    subjectOptional: 'Subject (optional)', questionDetails: 'Question details...', ask: 'Ask',
    leaderboard: '🥇 Leaderboard', backToQuestions: '⬅ Back to Questions', writeAnswer: 'Write your answer...',
    submitAnswer: 'Submit Answer', changePhoto: 'Change profile photo', post_: 'Posts',
    followers: 'Followers', following_: 'Following', noBio: 'No bio yet', editBio: 'Edit Bio',
    myPosts: 'My Posts', saved: 'Saved', discoverStudents: 'Students you might know',
    accountSettings: 'Account Settings', appTheme: 'App Color', applyColor: 'Apply',
    fontSize: 'Font Size', small: 'Small', medium: 'Medium', large: 'Large', profilePrivacy: 'Profile Privacy',
    visibleAll: 'Anyone can see', visibleFollowers: 'Followers only', visibleNone: 'Private',
    notifications: 'Notifications', notifLikes: 'Likes on my posts', notifComments: 'Comments on my posts',
    notifFollows: 'New followers', favSubjects: 'Favorite Subjects (comma-separated)', favSubjectsExample: 'e.g. Math, Physics',
    saveSubjects: 'Save Subjects', examFreeze: '🎓 Exam Freeze Mode',
    examFreezeDesc: 'Freeze notifications and incoming messages until this date. It turns back on automatically.',
    freezeUntil: 'Freeze Until This Date', unfreezeNow: 'Unfreeze Now', newUsername: 'New Username',
    enterNewUsername: 'Enter a new username', updateUsername: 'Update Username', newPassword: 'New Password',
    min6chars: 'At least 6 characters', updatePassword: 'Update Password', blockedUsers: 'Blocked Users',
    exportData: '📦 Export My Data (JSON)', deactivateAccount: '⏸ Deactivate Account',
    deleteData: '🗑 Delete My Data', close: 'Close',
    fillAllFields: 'Please fill in all fields', usernameTaken: 'That username is already taken',
    wrongCreds: 'Incorrect email or password', accountDeactivatedConfirm: 'Your account is deactivated. Reactivate it now?',
    newMessageFrom: 'New message from', newMessage: 'New message',
    likedYourPost: 'liked your post', commentedOnPost: 'commented on your post', startedFollowing: 'started following you',
    noNotifsYet: 'No notifications yet', enterUsername: 'Enter a username', usernameUpdated: 'Username updated successfully',
    passwordTooShort: 'Password must be at least 6 characters', passwordUpdated: 'Password updated successfully',
    subjectsSaved: 'Favorite subjects saved', pickEndDate: 'Pick an end date first', pickFutureDate: 'Pick a date in the future',
    examModeOn: 'Exam mode on until', examModeOff: 'Exam mode turned off', notFrozen: 'Not currently frozen',
    frozenUntil: 'Frozen until', noResults: 'No results', noBookmarksYet: "You haven't saved any posts yet",
    confirmBlock: 'Block this user?', noBlockedUsers: 'No blocked users', unblock: 'Unblock',
    confirmDeactivate: 'Your account will be deactivated until you log in again. Continue?', confirmDeleteData1: 'Warning: this will permanently delete all your posts and summaries. Are you sure?',
    confirmDeleteData2: 'Final confirmation: this cannot be undone. Continue?', dataDeleted: 'Your data has been deleted. You will be logged out now.',
    notFollowingAnyone: 'You are not following anyone yet', feedError: 'Failed to load feed', noPostsYet: 'No posts yet',
    writeSomethingFirst: 'Write something or add a photo first', posting: 'Posting...', postError: 'Error while posting: ',
    noComments: 'No comments yet', writeComment: 'Write a comment...', confirmDeleteComment: 'Delete this comment?',
    confirmDeletePost: 'Delete this post?', couldNotDelete: 'Could not delete: ',
    delete: 'Delete', edit: 'Edit', save: 'Save', enterTitleAndFile: 'Enter a title and choose a file',
    uploading: 'Uploading...', noSummariesYet: 'No summaries yet, be the first!', openFile: 'Open File',
    chooseVideoFirst: 'Choose a video first', noReelsYet: 'No reels yet, be the first!',
    confirmDeleteReel: 'Delete this reel?', enterGroupName: 'Enter a group name',
    noGroupsYet: 'No groups yet, create the first one', openChat: 'Open Chat', join: 'Join',
    enterProjectName: 'Enter a project name', noProjectsYet: 'No projects yet, create the first one', openProject: 'Open Project',
    noTasksYet: 'No tasks yet', tasksDone: 'tasks done', of: 'of', followBtn: 'Follow', followingBtn: 'Following',
    noOtherStudents: 'No other students yet', writeBio: 'Write your bio:', bioUpdateError: 'Could not update bio: ',
    photoUploadError: 'Could not upload photo: ', noActiveChallenge: 'No active challenge right now', by: 'by',
    enterChallengeTitle: 'Enter a challenge title', enterQuestionTitle: 'Enter a question title', noQuestionsYet: 'No questions yet, ask the first one',
    resolved: '✔ Resolved', answers: 'answers', noAnswersYet: 'No answers yet', bestAnswer: '✔ Best Answer',
    markBest: 'Mark as Best Answer', noLeaderboardData: 'No data yet', points: 'pts',
    noOtherUsers: 'No other users yet', confirmDeleteMsg: 'Delete this message?',
    userFrozenMsg: 'This user is in exam mode and not accepting messages right now.', couldNotSend: 'Could not send message: ',
    blockUserLabel: 'Block User', peopleYouMayKnow: 'People you may know',
    now: 'now', minAgo: 'm', hourAgo: 'h', dayAgo: 'd'
  }
};
let currentLang = localStorage.getItem('zomra-lang') || 'ar';
function t(key){ return (translations[currentLang] && translations[currentLang][key]) || key; }

function applyLang(){
  document.getElementById('htmlRoot').setAttribute('lang', currentLang);
  document.getElementById('htmlRoot').setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  document.getElementById('langBtn').textContent = currentLang === 'ar' ? 'EN' : 'ع';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(key === 'hi'){ el.childNodes[0].textContent = t('hi') + ' '; }
    else { el.textContent = t(key); }
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
}
function toggleLang(){
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('zomra-lang', currentLang);
  applyLang();
  if(currentUser){ loadFeed(); loadProfileTab(); loadLibrary(); loadGroups(); loadStories(); }
}
applyLang();

/* ============================================================
   نظام الألوان
   ============================================================ */
const colorPresets = ['#5865f2','#f24e8a','#22c55e','#f59e0b','#ef4444','#06b6d4','#a855f7','#eab308','#ec4899','#14b8a6','#6366f1','#84cc16'];

function hexToRgb(hex){
  return { r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) };
}
function shiftHue(hex){
  const { r, g, b } = hexToRgb(hex);
  const nr = Math.min(255, r + 40);
  const nb = Math.max(0, b - 20);
  return `#${nr.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${nb.toString(16).padStart(2,'0')}`;
}
function applyAccentColor(color){
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent2', shiftHue(color));
  renderColorGrid(color);
  const picker = document.getElementById('customColorPicker');
  if(picker) picker.value = color;
}
function renderColorGrid(activeColor){
  const grid = document.getElementById('colorGrid');
  if(!grid) return;
  grid.innerHTML = colorPresets.map(c => `<div class="colorSwatch ${c.toLowerCase()===activeColor.toLowerCase()?'active':''}" style="background:${c}" onclick="setAccentColor('${c}')"></div>`).join('');
}
async function setAccentColor(color){
  applyAccentColor(color);
  localStorage.setItem('zomra-accent', color);
  if(currentUser){
    currentProfile.accent_color = color;
    await sb.from('profiles').update({ accent_color: color }).eq('id', currentUser.id);
  }
}
function applyCustomColor(){
  setAccentColor(document.getElementById('customColorPicker').value);
}
(function initColor(){
  applyAccentColor(localStorage.getItem('zomra-accent') || '#5865f2');
})();

/* -------------------- حجم الخط -------------------- */
function applyFontSize(size){
  const scale = size === 'small' ? 0.9 : size === 'large' ? 1.15 : 1;
  document.documentElement.style.setProperty('--font-scale', scale);
  ['fontSmallBtn','fontMediumBtn','fontLargeBtn'].forEach(id=>document.getElementById(id)?.classList.remove('active'));
  const map = { small:'fontSmallBtn', medium:'fontMediumBtn', large:'fontLargeBtn' };
  document.getElementById(map[size])?.classList.add('active');
}
async function setFontSize(size){
  applyFontSize(size);
  if(currentUser){
    currentProfile.font_size = size;
    await sb.from('profiles').update({ font_size: size }).eq('id', currentUser.id);
  }
}

/* -------------------- دخول / تسجيل -------------------- */
function showSignup(){
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('signupForm').classList.remove('hidden');
  document.getElementById('authError').textContent = '';
}
function showLogin(){
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('authError').textContent = '';
}
async function signup(){
  const username = document.getElementById('suUsername').value.trim();
  const email = document.getElementById('suEmail').value.trim();
  const pass = document.getElementById('suPass').value;
  const errBox = document.getElementById('authError');
  errBox.textContent = '';
  if(!username || !email || !pass){ errBox.textContent = t('fillAllFields'); return; }
  const { data, error } = await sb.auth.signUp({ email, password: pass });
  if(error){ errBox.textContent = error.message; return; }
  const { error: profErr } = await sb.from('profiles').insert({ id: data.user.id, username });
  if(profErr){ errBox.textContent = t('usernameTaken'); return; }
  await afterLogin(data.user);
}
async function login(){
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  const errBox = document.getElementById('authError');
  errBox.textContent = '';
  const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
  if(error){ errBox.textContent = t('wrongCreds'); return; }
  await afterLogin(data.user);
}
async function logout(){
  if(globalMsgChannel){ sb.removeChannel(globalMsgChannel); globalMsgChannel = null; }
  await sb.auth.signOut();
  currentUser = null; currentProfile = null;
  document.getElementById('app').classList.add('hidden');
  document.getElementById('authScreen').classList.remove('hidden');
}
async function afterLogin(user){
  currentUser = user;
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  currentProfile = profile;

  if(profile.account_disabled){
    if(!confirm(t('accountDeactivatedConfirm'))){ await sb.auth.signOut(); return; }
    await sb.from('profiles').update({ account_disabled: false }).eq('id', user.id);
    currentProfile.account_disabled = false;
  }

  if(profile.exam_freeze_until){
    const today = new Date().toISOString().split('T')[0];
    if(profile.exam_freeze_until <= today){
      await sb.from('profiles').update({ exam_freeze_until: null }).eq('id', user.id);
      currentProfile.exam_freeze_until = null;
    }
  }

  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('meUsername').textContent = profile.username;

  applyFontSize(profile.font_size || 'medium');
  applyAccentColor(profile.accent_color || '#5865f2');
  applyLang();
  loadBlockedList();

  loadFeed();
  loadAllProfiles();
  loadProfileTab();
  loadLibrary();
  loadStories();
  loadGroups();
  loadNotifications();
  setupGlobalMessageListener();

  if('Notification' in window && Notification.permission === 'default'){
    Notification.requestPermission();
  }
}

function setupGlobalMessageListener(){
  if(globalMsgChannel) sb.removeChannel(globalMsgChannel);
  globalMsgChannel = sb.channel('global-messages-'+currentUser.id)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${currentUser.id}` }, async payload => {
      const m = payload.new;
      notificationSound.play().catch(()=>{});
      if('Notification' in window && Notification.permission === 'granted'){
        const { data: sender } = await sb.from('profiles').select('username').eq('id', m.sender_id).single();
        new Notification(sender ? `${t('newMessageFrom')} ${sender.username}` : t('newMessage'), { body: m.content, icon: 'icons/icon-192.png' });
      }
    })
    .subscribe();
}

function switchTab(name){
  document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.remove('active'));
  document.querySelector(`nav.tabs button[data-tab="${name}"]`).classList.add('active');
  document.querySelectorAll('.tabPanel').forEach(p=>p.classList.add('hidden'));
  document.getElementById('tab-'+name).classList.remove('hidden');
  if(name === 'library'){ loadLibrary(); }
  if(name === 'profile'){ viewingProfile = null; profileSubTab = 'posts'; loadProfileTab(); }
  if(name === 'groups'){ loadGroups(); }
  if(name === 'projects'){ loadProjects(); }
  if(name === 'qa'){ loadChallenge(); loadQuestions(); loadLeaderboard(); }
  document.getElementById('notifPanel').classList.add('hidden');
}

function timeAgo(dateStr){
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if(diff < 60) return t('now');
  if(diff < 3600) return Math.floor(diff/60)+t('minAgo');
  if(diff < 86400) return Math.floor(diff/3600)+t('hourAgo');
  return Math.floor(diff/86400)+t('dayAgo');
}
function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}
function skeletonPosts(count){
  let html = '';
  for(let i=0;i<count;i++){
    html += `<div class="skelPost"><div class="skelHead"><div class="skeleton skelAvatar"></div><div style="flex:1"><div class="skeleton skelLine w40"></div><div class="skeleton skelLine w60" style="height:8px"></div></div></div><div class="skeleton skelLine w90"></div><div class="skeleton skelLine w60"></div><div class="skeleton skelBlock"></div></div>`;
  }
  return html;
}

/* -------------------- رفع الملفات -------------------- */
async function compressImage(file, maxWidth = 1080, quality = 0.75){
  if(!file.type.startsWith('image/')) return file;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if(width > maxWidth){ height = Math.round(height * (maxWidth / width)); width = maxWidth; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if(blob){ resolve(new File([blob], file.name.replace(/\.[^.]+$/, '')+'.webp', { type: 'image/webp' })); }
        else { resolve(file); }
      }, 'image/webp', quality);
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}
async function uploadToStorage(file, folder){
  let finalFile = file;
  if(file.type.startsWith('image/') && folder !== 'library'){ finalFile = await compressImage(file); }
  const ext = finalFile.name.split('.').pop();
  const path = `${folder}/${currentUser.id}-${Date.now()}.${ext}`;
  const arrayBuffer = await finalFile.arrayBuffer();
  const { error } = await sb.storage.from('zomra').upload(path, arrayBuffer, { contentType: finalFile.type });
  if(error) throw error;
  const { data } = sb.storage.from('zomra').getPublicUrl(path);
  return data.publicUrl;
}
function extractStoragePath(publicUrl){
  const marker = '/storage/v1/object/public/zomra/';
  const idx = publicUrl.indexOf(marker);
  return idx === -1 ? null : publicUrl.substring(idx + marker.length);
}
function avatarHtml(profile){
  if(profile.avatar_url) return `<img src="${profile.avatar_url}">`;
  return profile.username[0].toUpperCase();
}

/* -------------------- الإشعارات -------------------- */
async function createNotification(targetUserId, type, postId=null){
  if(targetUserId === currentUser.id) return;
  const { data: target } = await sb.from('profiles').select('notif_likes, notif_comments, notif_follows, exam_freeze_until').eq('id', targetUserId).single();
  if(!target) return;
  if(target.exam_freeze_until){
    const today = new Date().toISOString().split('T')[0];
    if(target.exam_freeze_until > today) return;
  }
  if(type === 'like' && target.notif_likes === false) return;
  if(type === 'comment' && target.notif_comments === false) return;
  if(type === 'follow' && target.notif_follows === false) return;
  await sb.from('notifications').insert({ user_id: targetUserId, actor_id: currentUser.id, type, post_id: postId });
}
async function loadNotifications(){
  const { data } = await sb.from('notifications').select('*, profiles!notifications_actor_id_fkey(username)').eq('user_id', currentUser.id).order('created_at', { ascending: false }).limit(30);
  const unread = (data||[]).filter(n => !n.is_read).length;
  document.getElementById('bellDot').style.display = unread > 0 ? 'block' : 'none';
  const typeLabel = { like: t('likedYourPost'), comment: t('commentedOnPost'), follow: t('startedFollowing') };
  document.getElementById('notifPanel').innerHTML = (data||[]).map(n => `<div class="notifItem"><b>${escapeHtml(n.profiles.username)}</b> ${typeLabel[n.type]||''} · ${timeAgo(n.created_at)}</div>`).join('') || `<div class="notifItem">${t('noNotifsYet')}</div>`;
}
async function toggleNotifPanel(){
  const panel = document.getElementById('notifPanel');
  panel.classList.toggle('hidden');
  if(!panel.classList.contains('hidden')){
    await sb.from('notifications').update({ is_read: true }).eq('user_id', currentUser.id).eq('is_read', false);
    document.getElementById('bellDot').style.display = 'none';
  }
}

/* -------------------- إعدادات الحساب -------------------- */
function openSettings(){
  document.getElementById('settingsPanel').classList.add('show');
  document.getElementById('settingsError').textContent = '';
  document.getElementById('settingsSuccess').textContent = '';
  document.getElementById('privacySelect').value = currentProfile.privacy_level || 'public';
  document.getElementById('notifLikesChk').checked = currentProfile.notif_likes !== false;
  document.getElementById('notifCommentsChk').checked = currentProfile.notif_comments !== false;
  document.getElementById('notifFollowsChk').checked = currentProfile.notif_follows !== false;
  document.getElementById('favSubjectsInput').value = currentProfile.favorite_subjects || '';
  applyFontSize(currentProfile.font_size || 'medium');
  renderColorGrid(currentProfile.accent_color || '#5865f2');
  renderExamFreezeStatus();
}
function closeSettings(){ document.getElementById('settingsPanel').classList.remove('show'); }

async function changeUsername(){
  const val = document.getElementById('newUsername').value.trim();
  const err = document.getElementById('settingsError'); const ok = document.getElementById('settingsSuccess');
  err.textContent = ''; ok.textContent = '';
  if(!val){ err.textContent = t('enterUsername'); return; }
  const { error } = await sb.from('profiles').update({ username: val }).eq('id', currentUser.id);
  if(error){ err.textContent = t('usernameTaken'); return; }
  currentProfile.username = val;
  document.getElementById('meUsername').textContent = val;
  document.getElementById('newUsername').value = '';
  ok.textContent = t('usernameUpdated');
  if(!viewingProfile) loadProfileTab();
}
async function changePassword(){
  const val = document.getElementById('newPassword').value;
  const err = document.getElementById('settingsError'); const ok = document.getElementById('settingsSuccess');
  err.textContent = ''; ok.textContent = '';
  if(!val || val.length < 6){ err.textContent = t('passwordTooShort'); return; }
  const { error } = await sb.auth.updateUser({ password: val });
  if(error){ err.textContent = error.message; return; }
  document.getElementById('newPassword').value = '';
  ok.textContent = t('passwordUpdated');
}
async function updatePrivacy(){
  const val = document.getElementById('privacySelect').value;
  currentProfile.privacy_level = val;
  await sb.from('profiles').update({ privacy_level: val }).eq('id', currentUser.id);
}
async function updateNotifPrefs(){
  const likes = document.getElementById('notifLikesChk').checked;
  const comments = document.getElementById('notifCommentsChk').checked;
  const follows = document.getElementById('notifFollowsChk').checked;
  currentProfile.notif_likes = likes; currentProfile.notif_comments = comments; currentProfile.notif_follows = follows;
  await sb.from('profiles').update({ notif_likes: likes, notif_comments: comments, notif_follows: follows }).eq('id', currentUser.id);
}
async function saveFavoriteSubjects(){
  const val = document.getElementById('favSubjectsInput').value.trim();
  currentProfile.favorite_subjects = val;
  await sb.from('profiles').update({ favorite_subjects: val }).eq('id', currentUser.id);
  document.getElementById('settingsSuccess').textContent = t('subjectsSaved');
}

/* -------------------- تجميد الحساب وقت الامتحانات -------------------- */
function renderExamFreezeStatus(){
  const wrap = document.getElementById('examFreezeStatus');
  const unfreezeBtn = document.getElementById('unfreezeBtn');
  if(currentProfile.exam_freeze_until){
    wrap.innerHTML = `<span style="color:#f59e0b;font-size:13px">🎓 ${t('frozenUntil')} ${currentProfile.exam_freeze_until}</span>`;
    unfreezeBtn.classList.remove('hidden');
  } else {
    wrap.innerHTML = `<span class="muted">${t('notFrozen')}</span>`;
    unfreezeBtn.classList.add('hidden');
  }
}
async function freezeForExams(){
  const date = document.getElementById('examFreezeDate').value;
  const err = document.getElementById('settingsError'); const ok = document.getElementById('settingsSuccess');
  err.textContent = ''; ok.textContent = '';
  if(!date){ err.textContent = t('pickEndDate'); return; }
  const today = new Date().toISOString().split('T')[0];
  if(date <= today){ err.textContent = t('pickFutureDate'); return; }
  await sb.from('profiles').update({ exam_freeze_until: date, notif_likes: false, notif_comments: false, notif_follows: false }).eq('id', currentUser.id);
  currentProfile.exam_freeze_until = date;
  currentProfile.notif_likes = false; currentProfile.notif_comments = false; currentProfile.notif_follows = false;
  document.getElementById('notifLikesChk').checked = false;
  document.getElementById('notifCommentsChk').checked = false;
  document.getElementById('notifFollowsChk').checked = false;
  ok.textContent = `${t('examModeOn')} ${date}`;
  renderExamFreezeStatus();
  if(!viewingProfile) loadProfileTab();
}
async function unfreezeAccount(){
  await sb.from('profiles').update({ exam_freeze_until: null }).eq('id', currentUser.id);
  currentProfile.exam_freeze_until = null;
  document.getElementById('settingsSuccess').textContent = t('examModeOff');
  renderExamFreezeStatus();
  if(!viewingProfile) loadProfileTab();
}

async function loadBlockedList(){
  const { data } = await sb.from('blocked_users').select('blocked_id, profiles!blocked_users_blocked_id_fkey(username)').eq('blocker_id', currentUser.id);
  blockedIds = (data||[]).map(b=>b.blocked_id);
  const list = document.getElementById('blockedUsersList');
  if(!list) return;
  list.innerHTML = (data||[]).map(b => `<div class="blockedRow"><span>${escapeHtml(b.profiles.username)}</span><button onclick="unblockUser('${b.blocked_id}')">${t('unblock')}</button></div>`).join('') || `<div class="muted">${t('noBlockedUsers')}</div>`;
}
async function blockUser(userId){
  if(!confirm(t('confirmBlock'))) return;
  await sb.from('blocked_users').insert({ blocker_id: currentUser.id, blocked_id: userId });
  blockedIds.push(userId);
  loadBlockedList();
  loadFeed();
  if(viewingProfile) switchTab('feed');
}
async function unblockUser(userId){
  await sb.from('blocked_users').delete().eq('blocker_id', currentUser.id).eq('blocked_id', userId);
  blockedIds = blockedIds.filter(id=>id!==userId);
  loadBlockedList();
  loadFeed();
}

async function exportMyData(){
  const { data: posts } = await sb.from('posts').select('*').eq('user_id', currentUser.id);
  const { data: library } = await sb.from('library_posts').select('*').eq('user_id', currentUser.id);
  const exportObj = { profile: currentProfile, posts: posts||[], library: library||[] };
  const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'zomra-data-'+currentProfile.username+'.json';
  a.click();
  URL.revokeObjectURL(url);
}
async function disableAccount(){
  if(!confirm(t('confirmDeactivate'))) return;
  await sb.from('profiles').update({ account_disabled: true }).eq('id', currentUser.id);
  await logout();
}
async function deleteAccountData(){
  if(!confirm(t('confirmDeleteData1'))) return;
  if(!confirm(t('confirmDeleteData2'))) return;
  await sb.from('posts').delete().eq('user_id', currentUser.id);
  await sb.from('library_posts').delete().eq('user_id', currentUser.id);
  await sb.from('reels').delete().eq('user_id', currentUser.id);
  alert(t('dataDeleted'));
  await logout();
}

/* -------------------- البحث -------------------- */
let searchTimeout = null;
function handleSearch(){
  clearTimeout(searchTimeout);
  const q = document.getElementById('searchInput').value.trim();
  const box = document.getElementById('searchResults');
  if(!q){ box.innerHTML = ''; return; }
  searchTimeout = setTimeout(async () => {
    const { data: users } = await sb.from('profiles').select('*').ilike('username', `%${q}%`).limit(5);
    const { data: posts } = await sb.from('posts').select('*, profiles(username)').ilike('content', `%${q}%`).limit(5);
    let html = '';
    (users||[]).forEach(u => { html += `<div class="searchResultRow" onclick='openUserProfile("${u.id}", ${JSON.stringify(u.username)})'>👤 <b>${escapeHtml(u.username)}</b></div>`; });
    (posts||[]).forEach(p => { html += `<div class="searchResultRow">📝 ${escapeHtml(p.profiles.username)}: ${escapeHtml((p.content||'').slice(0,50))}</div>`; });
    box.innerHTML = html || `<div class="searchResultRow">${t('noResults')}</div>`;
  }, 300);
}

/* -------------------- الستوريز -------------------- */
async function loadStories(){
  const { data } = await sb.from('stories').select('*, profiles(username, avatar_url)').gt('expires_at', new Date().toISOString()).order('created_at', { ascending: false });
  const grouped = {};
  (data||[]).forEach(s => { if(!grouped[s.user_id]) grouped[s.user_id] = { profile: s.profiles, stories: [] }; grouped[s.user_id].stories.push(s); });
  let html = `<div class="storyCircle" onclick="document.getElementById('storyFile').click()"><div class="ring addNew">+</div><div class="lbl">${currentLang==='ar'?'إضافة':'Add'}</div></div>`;
  Object.values(grouped).forEach(g => { html += `<div class="storyCircle" onclick='viewStories(${JSON.stringify(g.stories).replace(/'/g,"&apos;")})'><div class="ring">${avatarHtml(g.profile)}</div><div class="lbl">${escapeHtml(g.profile.username)}</div></div>`; });
  document.getElementById('storiesBar').innerHTML = html;
}
async function uploadStory(e){
  const file = e.target.files[0];
  if(!file) return;
  try{ const url = await uploadToStorage(file, 'stories'); await sb.from('stories').insert({ user_id: currentUser.id, image_url: url }); loadStories(); }
  catch(err){ alert('Error: '+err.message); }
}
let currentStoriesQueue = []; let currentStoryIndex = 0;
function viewStories(stories){ currentStoriesQueue = stories; currentStoryIndex = 0; showStoryAt(0); }
function showStoryAt(i){
  const s = currentStoriesQueue[i];
  if(!s){ closeStoryViewer(); return; }
  document.getElementById('storyViewer').classList.add('show');
  document.getElementById('storyViewerUser').textContent = s.profiles.username;
  const img = document.getElementById('storyViewerImg'); const txt = document.getElementById('storyViewerText');
  if(s.image_url){ img.src = s.image_url; img.classList.remove('hidden'); txt.classList.add('hidden'); }
  else { txt.textContent = s.content || ''; txt.classList.remove('hidden'); img.classList.add('hidden'); }
}
document.addEventListener('click', function(e){
  if(document.getElementById('storyViewer').classList.contains('show') && e.target.id === 'storyViewer'){
    currentStoryIndex++;
    if(currentStoryIndex >= currentStoriesQueue.length) closeStoryViewer(); else showStoryAt(currentStoryIndex);
  }
});
function closeStoryViewer(){ document.getElementById('storyViewer').classList.remove('show'); }

function setFeedFilter(f){
  feedFilter = f;
  document.getElementById('filterAll').classList.toggle('active', f==='all');
  document.getElementById('filterFollowing').classList.toggle('active', f==='following');
  loadFeed();
}
function previewPostImg(e){
  const file = e.target.files[0];
  if(!file) return;
  selectedPostFile = file;
  const preview = document.getElementById('postImgPreview');
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
}
async function createPost(){
  const content = document.getElementById('postContent').value.trim();
  if(!content && !selectedPostFile){ alert(t('writeSomethingFirst')); return; }
  const btn = document.getElementById('postBtn');
  btn.disabled = true; btn.textContent = t('posting');
  try{
    let imageUrl = null;
    if(selectedPostFile) imageUrl = await uploadToStorage(selectedPostFile, 'posts');
    const { error } = await sb.from('posts').insert({ user_id: currentUser.id, content, image_url: imageUrl });
    if(error) throw error;
    recordActivity(5);
    document.getElementById('postContent').value = '';
    document.getElementById('postImgFile').value = '';
    document.getElementById('postImgPreview').style.display = 'none';
    selectedPostFile = null;
    loadFeed();
  }catch(err){ alert(t('postError') + err.message); }
  finally{ btn.disabled = false; btn.textContent = t('post'); }
}

/* -------------------- الفيد -------------------- */
async function loadFeed(){
  feedOffset = 0;
  document.getElementById('feedList').innerHTML = skeletonPosts(3);
  await fetchFeedPage(true);
}
async function loadMoreFeed(){ await fetchFeedPage(false); }
async function fetchFeedPage(isFirstLoad){
  const list = document.getElementById('feedList');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  let query = sb.from('posts').select('*, profiles(username, avatar_url), likes(user_id), comments(*, profiles(username)), bookmarks(user_id)').order('created_at', { ascending: false }).range(feedOffset, feedOffset + FEED_PAGE_SIZE - 1);
  if(feedFilter === 'following'){
    const { data: myFollows } = await sb.from('follows').select('following_id').eq('follower_id', currentUser.id);
    const ids = (myFollows||[]).map(f=>f.following_id);
    if(!ids.length){ list.innerHTML = `<div class="empty">${t('notFollowingAnyone')}</div>`; loadMoreBtn.classList.add('hidden'); return; }
    query = query.in('user_id', ids);
  }
  const { data: posts, error } = await query;
  if(error){ list.innerHTML = `<div class="empty">${t('feedError')}</div>`; return; }
  const filtered = (posts||[]).filter(p => !blockedIds.includes(p.user_id));
  if(isFirstLoad && !filtered.length){ list.innerHTML = `<div class="empty">${t('noPostsYet')}</div>`; loadMoreBtn.classList.add('hidden'); return; }
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  const html = shuffled.map(p => renderPost(p)).join('');
  if(isFirstLoad) list.innerHTML = html; else list.insertAdjacentHTML('beforeend', html);
  feedOffset += FEED_PAGE_SIZE;
  loadMoreBtn.classList.toggle('hidden', (posts||[]).length < FEED_PAGE_SIZE);
}

function renderPost(p){
  const liked = p.likes.some(l => l.user_id === currentUser.id);
  const saved = (p.bookmarks||[]).some(b => b.user_id === currentUser.id);
  const commentsHtml = p.comments.map(c => renderComment(c, p.id)).join('');
  const deleteBtn = (p.user_id === currentUser.id) ? `<button class="ownerDelete" onclick="deletePost('${p.id}')">🗑 ${t('delete')}</button>` : '';
  return `<div class="post">
      <div class="head" onclick='openUserProfile("${p.user_id}", ${JSON.stringify(p.profiles.username)})'>
        <div class="avatar">${avatarHtml(p.profiles)}</div>
        <div><div class="name">${p.profiles.username}</div><div class="time">${timeAgo(p.created_at)}</div></div>
      </div>
      ${p.content ? `<div class="content">${escapeHtml(p.content)}</div>` : ''}
      ${p.image_url ? `<img class="postImg" src="${p.image_url}" loading="lazy">` : ''}
      <div class="actions">
        <button class="${liked?'liked':''}" onclick="toggleLike('${p.id}', ${liked}, '${p.user_id}')">${liked?'❤️':'🤍'} ${p.likes.length}</button>
        <button onclick="toggleComments('${p.id}')">💬 ${p.comments.length}</button>
        <button class="${saved?'saved':''}" onclick="toggleBookmark('${p.id}', ${saved}, this)">${saved?'🔖':'📑'}</button>
        ${deleteBtn}
      </div>
      <div class="comments hidden" id="comments-${p.id}">
        ${commentsHtml || `<div class="comment" style="color:var(--muted)">${t('noComments')}</div>`}
        <form class="commentForm" onsubmit="addComment(event,'${p.id}','${p.user_id}')">
          <input type="text" placeholder="${t('writeComment')}" id="commentInput-${p.id}">
          <button class="btn" type="submit">${t('send')}</button>
        </form>
      </div>
    </div>`;
}
function renderComment(c, postId){
  const isMine = c.user_id === currentUser.id;
  return `<div class="comment" id="comment-${c.id}">
      <div class="txt" id="commentTxt-${c.id}"><b onclick='openUserProfile("${c.user_id}", ${JSON.stringify(c.profiles.username)})'>${c.profiles.username}</b>: ${escapeHtml(c.content)}</div>
      ${isMine ? `<div class="cActions"><span onclick="startEditComment('${c.id}', '${postId}')">${t('edit')}</span><span onclick="deleteComment('${c.id}', '${postId}')">${t('delete')}</span></div>` : ''}
    </div>`;
}
function toggleComments(postId){ document.getElementById('comments-'+postId).classList.toggle('hidden'); }
async function toggleLike(postId, isLiked, postOwnerId){
  if(isLiked){ await sb.from('likes').delete().eq('post_id', postId).eq('user_id', currentUser.id); }
  else { await sb.from('likes').insert({ post_id: postId, user_id: currentUser.id }); createNotification(postOwnerId, 'like', postId); }
  loadFeed();
}
async function toggleBookmark(postId, isSaved, btnEl){
  if(isSaved){ await sb.from('bookmarks').delete().eq('post_id', postId).eq('user_id', currentUser.id); }
  else { await sb.from('bookmarks').insert({ post_id: postId, user_id: currentUser.id }); }
  const newSaved = !isSaved;
  btnEl.classList.toggle('saved', newSaved);
  btnEl.textContent = newSaved ? '🔖' : '📑';
  btnEl.setAttribute('onclick', `toggleBookmark('${postId}', ${newSaved}, this)`);
  if(profileSubTab === 'saved') loadSavedPosts();
}
async function addComment(e, postId, postOwnerId){
  e.preventDefault();
  const input = document.getElementById('commentInput-'+postId);
  const content = input.value.trim();
  if(!content) return;
  await sb.from('comments').insert({ post_id: postId, user_id: currentUser.id, content });
  createNotification(postOwnerId, 'comment', postId);
  input.value = '';
  loadFeed();
}
function startEditComment(commentId, postId){
  const txtDiv = document.getElementById('commentTxt-'+commentId);
  const current = txtDiv.textContent.split(': ').slice(1).join(': ');
  txtDiv.innerHTML = `<input type="text" id="editInput-${commentId}" value="${escapeHtml(current)}" style="width:70%;padding:4px 8px;border-radius:6px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:12px"><span onclick="saveEditComment('${commentId}','${postId}')" style="color:var(--accent);cursor:pointer;font-size:11px;margin-right:6px">${t('save')}</span>`;
}
async function saveEditComment(commentId, postId){
  const newVal = document.getElementById('editInput-'+commentId).value.trim();
  if(!newVal) return;
  await sb.from('comments').update({ content: newVal }).eq('id', commentId);
  loadFeed();
  setTimeout(()=>document.getElementById('comments-'+postId)?.classList.remove('hidden'), 50);
}
async function deleteComment(commentId, postId){
  if(!confirm(t('confirmDeleteComment'))) return;
  await sb.from('comments').delete().eq('id', commentId);
  loadFeed();
  setTimeout(()=>document.getElementById('comments-'+postId)?.classList.remove('hidden'), 50);
}
async function deletePost(postId){
  if(!confirm(t('confirmDeletePost'))) return;
  const { data: post } = await sb.from('posts').select('image_url').eq('id', postId).single();
  const { error } = await sb.from('posts').delete().eq('id', postId);
  if(error){ alert(t('couldNotDelete') + error.message); return; }
  if(post && post.image_url){ const path = extractStoragePath(post.image_url); if(path) await sb.storage.from('zomra').remove([path]); }
  loadFeed(); loadProfileTab();
}

/* -------------------- المكتبة -------------------- */
function switchLibSubTab(name){
  document.getElementById('subTabSummaries').classList.toggle('active', name==='summaries');
  document.getElementById('subTabReels').classList.toggle('active', name==='reels');
  document.getElementById('librarySummaries').classList.toggle('hidden', name!=='summaries');
  document.getElementById('libraryReels').classList.toggle('hidden', name!=='reels');
}
function handleLibFileChange(e){ document.getElementById('libFileName').textContent = e.target.files[0]?.name || ''; }
function handleReelFileChange(e){ document.getElementById('reelFileName').textContent = e.target.files[0]?.name || ''; }
async function uploadLibraryItem(){
  const title = document.getElementById('libTitle').value.trim();
  const subject = document.getElementById('libSubject').value.trim();
  const yearLevel = document.getElementById('libYearLevel').value;
  const fileInput = document.getElementById('libFile');
  const file = fileInput.files[0];
  if(!title || !file){ alert(t('enterTitleAndFile')); return; }
  const btn = document.getElementById('libBtn');
  btn.disabled = true; btn.textContent = t('uploading');
  try{
    const fileUrl = await uploadToStorage(file, 'library');
    const { error } = await sb.from('library_posts').insert({ user_id: currentUser.id, title, subject: subject || null, file_url: fileUrl, file_type: file.type, year_level: yearLevel || null });
    if(error) throw error;
    recordActivity(10);
    document.getElementById('libTitle').value=''; document.getElementById('libSubject').value='';
    fileInput.value=''; document.getElementById('libFileName').textContent='';
    loadLibrary();
  }catch(err){ alert('Error: '+err.message); }
  finally{ btn.disabled=false; btn.textContent=t('uploadSummary'); }
}
async function loadLibrary(){
  document.getElementById('libraryList').innerHTML = skeletonPosts(2);
  const { data, error } = await sb.from('library_posts').select('*, profiles(username), library_likes(user_id)').order('created_at', {ascending:false});
  if(error){ document.getElementById('libraryList').innerHTML = `<div class="empty">${t('feedError')}</div>`; return; }
  const subjSelect = document.getElementById('libFilterSubject');
  const subjects = [...new Set((data||[]).map(d=>d.subject).filter(Boolean))];
  const currentSubjVal = subjSelect.value;
  subjSelect.innerHTML = `<option value="">${t('allSubjects')}</option>` + subjects.map(s=>`<option ${s===currentSubjVal?'selected':''}>${escapeHtml(s)}</option>`).join('');
  let filtered = data || [];
  const subjFilter = document.getElementById('libFilterSubject').value;
  if(subjFilter) filtered = filtered.filter(i => i.subject === subjFilter);
  const sortMode = document.getElementById('libFilterSort').value;
  if(sortMode === 'top') filtered.sort((a,b)=> b.library_likes.length - a.library_likes.length);
  const list = document.getElementById('libraryList');
  if(!filtered.length){ list.innerHTML = `<div class="empty">${t('noSummariesYet')}</div>`; return; }
  list.innerHTML = filtered.map(item => {
    const liked = item.library_likes.some(l=>l.user_id===currentUser.id);
    return `<div class="libCard"><div class="title">${escapeHtml(item.title)}</div>${item.subject ? `<div class="subject">${escapeHtml(item.subject)}${item.year_level ? ' · '+escapeHtml(item.year_level) : ''}</div>` : ''}<div class="meta">${item.profiles.username} · ${timeAgo(item.created_at)}</div><div class="row2"><a class="fileLink" href="${item.file_url}" target="_blank">${t('openFile')}</a><button class="likeBtn ${liked?'liked':''}" onclick="toggleLibraryLike('${item.id}', ${liked})">${liked?'⭐':'☆'} ${item.library_likes.length}</button>${item.user_id === currentUser.id ? `<button class="delBtn" onclick="deleteLibraryItem('${item.id}')">🗑 ${t('delete')}</button>` : ''}</div></div>`;
  }).join('');
}
async function toggleLibraryLike(id, isLiked){
  if(isLiked){ await sb.from('library_likes').delete().eq('library_id', id).eq('user_id', currentUser.id); }
  else { await sb.from('library_likes').insert({ library_id: id, user_id: currentUser.id }); }
  loadLibrary();
}
async function deleteLibraryItem(id){
  if(!confirm(t('confirmDeletePost'))) return;
  const { data: item } = await sb.from('library_posts').select('file_url').eq('id', id).single();
  const { error } = await sb.from('library_posts').delete().eq('id', id);
  if(error){ alert(t('couldNotDelete')+error.message); return; }
  if(item && item.file_url){ const path = extractStoragePath(item.file_url); if(path) await sb.storage.from('zomra').remove([path]); }
  loadLibrary();
}
async function uploadReel(){
  const caption = document.getElementById('reelCaption').value.trim();
  const fileInput = document.getElementById('reelFile');
  const file = fileInput.files[0];
  if(!file){ alert(t('chooseVideoFirst')); return; }
  const btn = document.getElementById('reelBtn');
  btn.disabled = true; btn.textContent = t('uploading');
  try{
    const videoUrl = await uploadToStorage(file, 'reels');
    const { error } = await sb.from('reels').insert({ user_id: currentUser.id, caption: caption || null, video_url: videoUrl });
    if(error) throw error;
    document.getElementById('reelCaption').value='';
    fileInput.value=''; document.getElementById('reelFileName').textContent='';
  }catch(err){ alert('Error: '+err.message); }
  finally{ btn.disabled=false; btn.textContent=t('uploadReel'); }
}
async function openReelsView(){ document.getElementById('reelsView').classList.add('show'); await loadReels(); }
function closeReelsView(){
  document.querySelectorAll('#reelsList video').forEach(v => v.pause());
  if(reelsObserver) reelsObserver.disconnect();
  document.getElementById('reelsView').classList.remove('show');
}
async function loadReels(){
  const { data, error } = await sb.from('reels').select('*, profiles(username), reel_likes(user_id)');
  const list = document.getElementById('reelsList');
  if(error){ list.innerHTML = `<div class="empty" style="color:white">${t('feedError')}</div>`; return; }
  if(!data.length){ list.innerHTML = `<div class="empty" style="color:white">${t('noReelsYet')}</div>`; return; }
  const shuffled = data.sort(() => Math.random() - 0.5);
  list.innerHTML = shuffled.map(r => {
    const liked = r.reel_likes.some(l=>l.user_id===currentUser.id);
    return `<div class="reelCard" data-id="${r.id}"><video src="${r.video_url}" loop playsinline muted preload="metadata"></video><div class="info"><div class="name" onclick='closeReelsView(); openUserProfile("${r.user_id}", ${JSON.stringify(r.profiles.username)})'>${r.profiles.username}</div>${r.caption ? `<div class="content">${escapeHtml(r.caption)}</div>` : ''}<div class="time">${timeAgo(r.created_at)}</div><div class="row3"><button class="reelLikeBtn" data-count="${r.reel_likes.length}" data-liked="${liked}" onclick="toggleReelLike('${r.id}', ${liked}, this)">${liked?'❤️':'🤍'} ${r.reel_likes.length}</button>${r.user_id === currentUser.id ? `<button class="delBtn" onclick="deleteReel('${r.id}')">🗑 ${t('delete')}</button>` : ''}</div></div></div>`;
  }).join('');
  setupReelsAutoplay();
}
async function toggleReelLike(reelId, isLiked, btnEl){
  if(isLiked){ await sb.from('reel_likes').delete().eq('reel_id', reelId).eq('user_id', currentUser.id); }
  else { await sb.from('reel_likes').insert({ reel_id: reelId, user_id: currentUser.id }); }
  const newLiked = !isLiked;
  const currentCount = parseInt(btnEl.dataset.count || '0');
  const newCount = newLiked ? currentCount + 1 : currentCount - 1;
  btnEl.dataset.count = newCount;
  btnEl.innerHTML = `${newLiked?'❤️':'🤍'} ${newCount}`;
  btnEl.setAttribute('onclick', `toggleReelLike('${reelId}', ${newLiked}, this)`);
}
function setupReelsAutoplay(){
  if(reelsObserver) reelsObserver.disconnect();
  reelsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if(!video) return;
      if(entry.isIntersecting){ video.muted = false; video.play().catch(()=>{ video.muted = true; video.play(); }); }
      else { video.pause(); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.reelCard').forEach(card => reelsObserver.observe(card));
}
async function deleteReel(id){
  if(!confirm(t('confirmDeleteReel'))) return;
  const { data: reel } = await sb.from('reels').select('video_url').eq('id', id).single();
  const { error } = await sb.from('reels').delete().eq('id', id);
  if(error){ alert(t('couldNotDelete')+error.message); return; }
  if(reel && reel.video_url){ const path = extractStoragePath(reel.video_url); if(path) await sb.storage.from('zomra').remove([path]); }
  loadReels();
}

/* -------------------- المجموعات الدراسية -------------------- */
async function createGroup(){
  const name = document.getElementById('groupName').value.trim();
  const subject = document.getElementById('groupSubject').value.trim();
  if(!name){ alert(t('enterGroupName')); return; }
  const { data, error } = await sb.from('study_groups').insert({ name, subject: subject||null, creator_id: currentUser.id }).select().single();
  if(error){ alert('Error: '+error.message); return; }
  await sb.from('group_members').insert({ group_id: data.id, user_id: currentUser.id });
  document.getElementById('groupName').value=''; document.getElementById('groupSubject').value='';
  loadGroups();
}
async function loadGroups(){
  document.getElementById('groupsList').innerHTML = skeletonPosts(2);
  const { data: groups } = await sb.from('study_groups').select('*').order('created_at',{ascending:false});
  const { data: myMemberships } = await sb.from('group_members').select('group_id').eq('user_id', currentUser.id);
  const myGroupIds = (myMemberships||[]).map(m=>m.group_id);
  document.getElementById('groupsList').innerHTML = (groups||[]).map(g => {
    const joined = myGroupIds.includes(g.id);
    return `<div class="groupCard"><div class="gname">${escapeHtml(g.name)}</div>${g.subject ? `<div class="gsubject">${escapeHtml(g.subject)}</div>` : ''}<div class="gmeta">${timeAgo(g.created_at)}</div><div class="row2">${joined ? `<button class="btn" onclick='openGroupChat("${g.id}", ${JSON.stringify(g.name)})'>${t('openChat')}</button>` : `<button class="btn" onclick="joinGroup('${g.id}')">${t('join')}</button>`}</div></div>`;
  }).join('') || `<div class="empty">${t('noGroupsYet')}</div>`;
}
async function joinGroup(groupId){ await sb.from('group_members').insert({ group_id: groupId, user_id: currentUser.id }); loadGroups(); }
async function openGroupChat(groupId, groupName){
  activeGroup = { id: groupId, name: groupName };
  document.getElementById('groupsListView').classList.add('hidden');
  document.getElementById('groupChatView').classList.remove('hidden');
  document.getElementById('groupChatTitle').textContent = groupName;
  await loadGroupMessages();
  if(groupChannel) sb.removeChannel(groupChannel);
  groupChannel = sb.channel('group-'+groupId).on('postgres_changes', { event:'INSERT', schema:'public', table:'group_messages' }, payload => {
    if(payload.new.group_id !== groupId) return;
    if(payload.new.sender_id === currentUser.id) return;
    appendGroupMessage(payload.new);
  }).subscribe();
}
function closeGroupChat(){
  document.getElementById('groupsListView').classList.remove('hidden');
  document.getElementById('groupChatView').classList.add('hidden');
  if(groupChannel){ sb.removeChannel(groupChannel); groupChannel = null; }
  activeGroup = null;
}
async function loadGroupMessages(){
  const { data } = await sb.from('group_messages').select('*, profiles(username)').eq('group_id', activeGroup.id).order('created_at',{ascending:true});
  const box = document.getElementById('groupChatBox');
  box.innerHTML = '';
  (data||[]).forEach(m => appendGroupMessage(m));
}
function appendGroupMessage(m){
  const box = document.getElementById('groupChatBox');
  const mine = m.sender_id === currentUser.id;
  const div = document.createElement('div');
  div.className = 'msg ' + (mine ? 'mine' : 'theirs');
  div.textContent = (mine ? '' : (m.profiles?.username ? m.profiles.username+': ' : '')) + m.content;
  box.appendChild(div); box.scrollTop = box.scrollHeight;
}
async function sendGroupMessage(e){
  e.preventDefault();
  const input = document.getElementById('groupChatInput');
  const content = input.value.trim();
  if(!content || !activeGroup) return;
  input.value = '';
  appendGroupMessage({ sender_id: currentUser.id, content });
  const { error } = await sb.from('group_messages').insert({ group_id: activeGroup.id, sender_id: currentUser.id, content });
  if(error){ alert(t('couldNotSend')+error.message); }
}

/* -------------------- مشاريع دراسية -------------------- */
async function createProject(){
  const title = document.getElementById('projectTitle').value.trim();
  const subject = document.getElementById('projectSubject').value.trim();
  if(!title){ alert(t('enterProjectName')); return; }
  const { data, error } = await sb.from('study_projects').insert({ title, subject: subject||null, creator_id: currentUser.id }).select().single();
  if(error){ alert('Error: '+error.message); return; }
  await sb.from('project_members').insert({ project_id: data.id, user_id: currentUser.id });
  document.getElementById('projectTitle').value=''; document.getElementById('projectSubject').value='';
  loadProjects();
}
async function loadProjects(){
  const { data: projects } = await sb.from('study_projects').select('*').order('created_at',{ascending:false});
  const { data: myMemberships } = await sb.from('project_members').select('project_id').eq('user_id', currentUser.id);
  const myIds = (myMemberships||[]).map(m=>m.project_id);
  document.getElementById('projectsList').innerHTML = (projects||[]).map(p => {
    const joined = myIds.includes(p.id);
    return `<div class="projectCard"><div class="gname">${escapeHtml(p.title)}</div>${p.subject ? `<div class="gsubject">${escapeHtml(p.subject)}</div>` : ''}<div class="gmeta">${timeAgo(p.created_at)}</div><div class="row2">${joined ? `<button class="btn" onclick='openProjectDetail("${p.id}", ${JSON.stringify(p.title)})'>${t('openProject')}</button>` : `<button class="btn" onclick="joinProject('${p.id}')">${t('join')}</button>`}</div></div>`;
  }).join('') || `<div class="empty">${t('noProjectsYet')}</div>`;
}
async function joinProject(id){ await sb.from('project_members').insert({ project_id: id, user_id: currentUser.id }); loadProjects(); }
async function openProjectDetail(id, title){
  activeProject = id;
  document.getElementById('projectsListView').classList.add('hidden');
  document.getElementById('projectDetailView').classList.remove('hidden');
  document.getElementById('projectDetailTitle').textContent = title;
  loadTasks();
}
function closeProjectDetail(){
  document.getElementById('projectsListView').classList.remove('hidden');
  document.getElementById('projectDetailView').classList.add('hidden');
  activeProject = null;
}
async function addTask(){
  const title = document.getElementById('taskTitle').value.trim();
  if(!title || !activeProject) return;
  await sb.from('project_tasks').insert({ project_id: activeProject, title });
  document.getElementById('taskTitle').value = '';
  loadTasks();
}
async function loadTasks(){
  const { data } = await sb.from('project_tasks').select('*').eq('project_id', activeProject).order('created_at',{ascending:true});
  const tasks = data || [];
  const done = tasks.filter(tk=>tk.is_done).length;
  const pct = tasks.length ? Math.round((done/tasks.length)*100) : 0;
  document.getElementById('projectProgressBar').style.width = pct+'%';
  document.getElementById('projectProgressText').textContent = `${done} ${t('of')} ${tasks.length} ${t('tasksDone')} (${pct}%)`;
  document.getElementById('tasksList').innerHTML = tasks.map(tk => `<div class="taskRow ${tk.is_done?'done':''}"><input type="checkbox" ${tk.is_done?'checked':''} onchange="toggleTask('${tk.id}', this.checked)"><span class="taskLabel">${escapeHtml(tk.title)}</span><span class="muted" style="cursor:pointer" onclick="deleteTask('${tk.id}')">🗑</span></div>`).join('') || `<div class="empty">${t('noTasksYet')}</div>`;
}
async function toggleTask(id, done){ await sb.from('project_tasks').update({ is_done: done }).eq('id', id); loadTasks(); }
async function deleteTask(id){ await sb.from('project_tasks').delete().eq('id', id); loadTasks(); }

/* -------------------- البروفايل -------------------- */
function openUserProfile(userId, username){
  if(userId === currentUser.id){ switchTab('profile'); return; }
  viewingProfile = { id: userId, username };
  document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tabPanel').forEach(p=>p.classList.add('hidden'));
  document.getElementById('tab-profile').classList.remove('hidden');
  document.getElementById('notifPanel').classList.add('hidden');
  loadProfileTab();
}
function switchProfileSubTab(name){
  profileSubTab = name;
  document.getElementById('profTabPosts').classList.toggle('active', name==='posts');
  document.getElementById('profTabSaved').classList.toggle('active', name==='saved');
  document.getElementById('profPostsGrid').classList.toggle('hidden', name!=='posts');
  document.getElementById('savedPostsList').classList.toggle('hidden', name!=='saved');
  if(name === 'saved') loadSavedPosts();
}
async function loadSavedPosts(){
  const list = document.getElementById('savedPostsList');
  list.innerHTML = skeletonPosts(2);
  const { data, error } = await sb.from('bookmarks').select('post_id, posts(*, profiles(username, avatar_url), likes(user_id), comments(*, profiles(username)), bookmarks(user_id))').eq('user_id', currentUser.id).order('created_at', { ascending: false });
  if(error){ list.innerHTML = `<div class="empty">${t('feedError')}</div>`; return; }
  const posts = (data||[]).map(b=>b.posts).filter(Boolean);
  list.innerHTML = posts.length ? posts.map(p=>renderPost(p)).join('') : `<div class="empty">${t('noBookmarksYet')}</div>`;
}
async function loadProfileTab(){
  const isOwn = !viewingProfile;
  const targetId = isOwn ? currentUser.id : viewingProfile.id;
  let profileData;
  if(isOwn){ profileData = currentProfile; }
  else { const { data } = await sb.from('profiles').select('*').eq('id', targetId).single(); profileData = data; }

  document.getElementById('profAvatarBig').innerHTML = avatarHtml(profileData);
  document.getElementById('profUsername').textContent = profileData.username;
  document.getElementById('profBio').textContent = profileData.bio || t('noBio');
  if(!isOwn) viewingProfile.data = profileData;
  renderStreakAndBadges();

  const examWrap = document.getElementById('examBadgeWrap');
  if(profileData.exam_freeze_until){
    examWrap.classList.remove('hidden');
    examWrap.innerHTML = `<div class="examBadge">🎓 ${t('frozenUntil')} ${profileData.exam_freeze_until}</div>`;
  } else {
    examWrap.classList.add('hidden');
    examWrap.innerHTML = '';
  }

  document.getElementById('avatarEditRow').classList.toggle('hidden', !isOwn);
  document.getElementById('editBioBtn').classList.toggle('hidden', !isOwn);
  document.getElementById('discoverSection').classList.toggle('hidden', !isOwn);
  document.getElementById('profileTabsRow').classList.toggle('hidden', !isOwn);
  document.getElementById('savedPostsList').classList.add('hidden');
  document.getElementById('profPostsGrid').classList.remove('hidden');

  const { count: postsCount } = await sb.from('posts').select('*', {count:'exact', head:true}).eq('user_id', targetId);
  const { count: followersCount } = await sb.from('follows').select('*', {count:'exact', head:true}).eq('following_id', targetId);
  const { count: followingCount } = await sb.from('follows').select('*', {count:'exact', head:true}).eq('follower_id', targetId);
  document.getElementById('statPostsCount').textContent = postsCount || 0;
  document.getElementById('statFollowersCount').textContent = followersCount || 0;
  document.getElementById('statFollowingCount').textContent = followingCount || 0;

  const followWrap = document.getElementById('profileFollowWrap');
  const blockWrap = document.getElementById('profileBlockWrap');
  if(isOwn){ followWrap.classList.add('hidden'); blockWrap.classList.add('hidden'); }
  else {
    followWrap.classList.remove('hidden'); blockWrap.classList.remove('hidden');
    const { data: myFollow } = await sb.from('follows').select('*').eq('follower_id', currentUser.id).eq('following_id', targetId).maybeSingle();
    const isFollowing = !!myFollow;
    followWrap.innerHTML = `<button class="followBtn ${isFollowing?'following':''}" onclick="toggleFollowOnProfile('${targetId}', ${isFollowing})">${isFollowing?t('followingBtn'):t('followBtn')}</button>`;
    const isBlocked = blockedIds.includes(targetId);
    blockWrap.innerHTML = isBlocked
      ? `<button class="blockBtn" onclick="unblockUser('${targetId}')">${t('unblock')}</button>`
      : `<button class="blockBtn" onclick="blockUser('${targetId}')">${t('blockUserLabel')}</button>`;
  }

  const { data: posts } = await sb.from('posts').select('*').eq('user_id', targetId).order('created_at', { ascending: false });
  document.getElementById('profPostsGrid').innerHTML = (posts||[]).map(p => `<div class="cell" onclick="switchTab('feed')">${p.image_url ? `<img src="${p.image_url}" loading="lazy">` : `<div class="txt">${escapeHtml((p.content||'').slice(0,60))}</div>`}</div>`).join('') || `<div class="empty">${t('noPostsYet')}</div>`;

  if(isOwn) loadDiscoverList();
}
async function toggleFollowOnProfile(targetId, isFollowing){
  if(isFollowing){ await sb.from('follows').delete().eq('follower_id', currentUser.id).eq('following_id', targetId); }
  else { await sb.from('follows').insert({ follower_id: currentUser.id, following_id: targetId }); createNotification(targetId, 'follow'); }
  loadProfileTab();
}

/* -------------------- اقتراح المتابعة الذكي -------------------- */
async function loadDiscoverList(){
  const { data: others } = await sb.from('profiles').select('*').neq('id', currentUser.id);
  const { data: myFollows } = await sb.from('follows').select('following_id').eq('follower_id', currentUser.id);
  const followingIds = (myFollows||[]).map(f=>f.following_id);

  let mutualCounts = {};
  if(followingIds.length){
    const { data: friendsOfFriends } = await sb.from('follows').select('follower_id, following_id').in('follower_id', followingIds);
    (friendsOfFriends||[]).forEach(row => {
      if(row.following_id === currentUser.id) return;
      if(followingIds.includes(row.following_id)) return;
      mutualCounts[row.following_id] = (mutualCounts[row.following_id] || 0) + 1;
    });
  }

  const visible = (others||[]).filter(u => !blockedIds.includes(u.id) && !followingIds.includes(u.id));
  visible.sort((a,b) => (mutualCounts[b.id]||0) - (mutualCounts[a.id]||0));

  const hasMutuals = visible.some(u => mutualCounts[u.id] > 0);
  document.getElementById('discoverTitle').textContent = hasMutuals ? t('peopleYouMayKnow') : t('discoverStudents');

  document.getElementById('discoverUsersList').innerHTML = visible.slice(0, 15).map(u => {
    const mutuals = mutualCounts[u.id] || 0;
    const mutualLabel = mutuals > 0
      ? (currentLang === 'ar' ? `${mutuals} من أصحابك بيتابعوه` : `${mutuals} mutual friend${mutuals>1?'s':''}`)
      : '';
    return `
      <div class="discoverRow">
        <div class="who" onclick='openUserProfile("${u.id}", ${JSON.stringify(u.username)})'>
          <div class="avatar" style="width:30px;height:30px;font-size:12px">${avatarHtml(u)}</div>
          <div>
            <div>${escapeHtml(u.username)}</div>
            ${mutualLabel ? `<div class="muted" style="font-size:11px">${mutualLabel}</div>` : ''}
          </div>
        </div>
        <button class="followBtn" onclick="toggleFollow('${u.id}', false)">${t('followBtn')}</button>
      </div>
    `;
  }).join('') || `<div class="empty">${t('noOtherStudents')}</div>`;
}
async function toggleFollow(targetId, isFollowing){
  if(isFollowing){ await sb.from('follows').delete().eq('follower_id', currentUser.id).eq('following_id', targetId); }
  else { await sb.from('follows').insert({ follower_id: currentUser.id, following_id: targetId }); createNotification(targetId, 'follow'); }
  loadDiscoverList();
}
function editBio(){
  const newBio = prompt(t('writeBio'), currentProfile.bio || '');
  if(newBio === null) return;
  sb.from('profiles').update({ bio: newBio }).eq('id', currentUser.id).then(({error})=>{
    if(error){ alert(t('bioUpdateError')+error.message); return; }
    currentProfile.bio = newBio;
    document.getElementById('profBio').textContent = newBio || t('noBio');
  });
}
async function uploadAvatar(e){
  const file = e.target.files[0];
  if(!file) return;
  try{
    const url = await uploadToStorage(file, 'avatars');
    const { error } = await sb.from('profiles').update({ avatar_url: url }).eq('id', currentUser.id);
    if(error) throw error;
    currentProfile.avatar_url = url;
    loadProfileTab(); loadFeed();
  }catch(err){ alert(t('photoUploadError') + err.message); }
}

/* -------------------- النقاط والستريك والشارات -------------------- */
async function recordActivity(pointsToAdd){
  const today = new Date().toISOString().split('T')[0];
  const { data: profile } = await sb.from('profiles').select('points, current_streak, longest_streak, last_activity_date').eq('id', currentUser.id).single();
  let newStreak = profile.current_streak || 0;
  if(profile.last_activity_date !== today){
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    newStreak = (profile.last_activity_date === yesterday) ? newStreak + 1 : 1;
  }
  const newLongest = Math.max(newStreak, profile.longest_streak || 0);
  const newPoints = (profile.points || 0) + pointsToAdd;
  await sb.from('profiles').update({ points: newPoints, current_streak: newStreak, longest_streak: newLongest, last_activity_date: today }).eq('id', currentUser.id);
  currentProfile.points = newPoints; currentProfile.current_streak = newStreak; currentProfile.longest_streak = newLongest;
  if(!viewingProfile) renderStreakAndBadges();
}
async function awardPointsTo(userId, points){
  const { data: p } = await sb.from('profiles').select('points').eq('id', userId).single();
  if(p) await sb.from('profiles').update({ points: (p.points||0) + points }).eq('id', userId);
}
function getBadges(points, streak){
  const badges = [];
  if(points >= 50) badges.push('🌱');
  if(points >= 150) badges.push('⭐');
  if(points >= 400) badges.push('🏆');
  if(streak >= 7) badges.push('🔥');
  if(streak >= 30) badges.push('💎');
  return badges;
}
function renderStreakAndBadges(){
  const isOwn = !viewingProfile;
  const p = isOwn ? currentProfile : (viewingProfile.data || {});
  document.getElementById('streakBox').innerHTML = `<div class="sItem"><div class="sn">${p.points || 0}</div><div class="sl">${t('points')}</div></div><div class="sItem"><div class="sn">🔥 ${p.current_streak || 0}</div><div class="sl"></div></div><div class="sItem"><div class="sn">${p.longest_streak || 0}</div><div class="sl"></div></div>`;
  const badges = getBadges(p.points || 0, p.longest_streak || 0);
  document.getElementById('badgesRow').innerHTML = badges.length ? badges.map(b => `<span class="badgeChip">${b}</span>`).join('') : '';
}

/* -------------------- التحدي الأسبوعي -------------------- */
async function loadChallenge(){
  const { data } = await sb.from('weekly_challenges').select('*, profiles(username)').order('created_at', {ascending:false}).limit(1);
  const box = document.getElementById('challengeContent');
  if(!data || !data.length){ box.innerHTML = `<div class="empty">${t('noActiveChallenge')}</div>`; return; }
  const c = data[0];
  box.innerHTML = `<div style="font-weight:600;font-size:15px">${escapeHtml(c.title)}</div>${c.description ? `<div class="muted" style="margin-top:4px">${escapeHtml(c.description)}</div>` : ''}<div class="muted" style="margin-top:6px">${t('by')} ${escapeHtml(c.profiles.username)} · ${timeAgo(c.created_at)}</div>`;
}
async function createChallenge(){
  const title = document.getElementById('challengeTitle').value.trim();
  const desc = document.getElementById('challengeDesc').value.trim();
  if(!title){ alert(t('enterChallengeTitle')); return; }
  const { error } = await sb.from('weekly_challenges').insert({ title, description: desc || null, created_by: currentUser.id });
  if(error){ alert('Error: '+error.message); return; }
  document.getElementById('challengeTitle').value = ''; document.getElementById('challengeDesc').value = '';
  loadChallenge();
}

/* -------------------- الأسئلة والأجوبة -------------------- */
async function askQuestion(){
  const title = document.getElementById('qTitle').value.trim();
  const subject = document.getElementById('qSubject').value.trim();
  const content = document.getElementById('qContent').value.trim();
  if(!title){ alert(t('enterQuestionTitle')); return; }
  const { error } = await sb.from('qa_questions').insert({ user_id: currentUser.id, title, subject: subject || null, content: content || null });
  if(error){ alert('Error: '+error.message); return; }
  document.getElementById('qTitle').value = ''; document.getElementById('qSubject').value = ''; document.getElementById('qContent').value = '';
  recordActivity(3);
  loadQuestions();
}
async function loadQuestions(){
  const { data, error } = await sb.from('qa_questions').select('*, profiles(username), qa_answers(id)').order('created_at', { ascending: false });
  const list = document.getElementById('questionsList');
  if(error){ list.innerHTML = `<div class="empty">${t('feedError')}</div>`; return; }
  if(!data.length){ list.innerHTML = `<div class="empty">${t('noQuestionsYet')}</div>`; return; }
  list.innerHTML = data.map(q => `<div class="qCard" onclick="openQuestion('${q.id}')"><div class="qtitle">${escapeHtml(q.title)} ${q.resolved_answer_id ? `<span class="qresolved">${t('resolved')}</span>` : ''}</div><div class="qmeta">${q.subject ? escapeHtml(q.subject)+' · ' : ''}${q.profiles.username} · ${timeAgo(q.created_at)} · ${q.qa_answers.length} ${t('answers')}</div></div>`).join('');
}
async function openQuestion(id){
  currentQuestionId = id;
  document.getElementById('qaListView').classList.add('hidden');
  document.getElementById('qaDetailView').classList.remove('hidden');
  const { data: q } = await sb.from('qa_questions').select('*, profiles(username)').eq('id', id).single();
  document.getElementById('qDetailTitle').textContent = q.title;
  document.getElementById('qDetailSubject').textContent = q.subject || '';
  document.getElementById('qDetailContent').textContent = q.content || '';
  loadAnswers(id, q.user_id, q.resolved_answer_id);
}
function closeQuestionDetail(){
  document.getElementById('qaListView').classList.remove('hidden');
  document.getElementById('qaDetailView').classList.add('hidden');
  currentQuestionId = null;
  loadQuestions();
}
async function loadAnswers(questionId, questionOwnerId, resolvedId){
  const { data } = await sb.from('qa_answers').select('*, profiles(username)').eq('question_id', questionId).order('created_at', {ascending:true});
  const isOwner = currentUser.id === questionOwnerId;
  document.getElementById('answersList').innerHTML = (data||[]).map(a => `<div class="answerCard ${a.id===resolvedId?'best':''}">${a.id===resolvedId ? `<div class="bestTag">${t('bestAnswer')}</div>` : ''}<div><b onclick='openUserProfile("${a.user_id}", ${JSON.stringify(a.profiles.username)})' style="color:var(--accent);cursor:pointer">${a.profiles.username}</b>: ${escapeHtml(a.content)}</div>${isOwner && a.id!==resolvedId ? `<button class="markBestBtn" onclick="markBestAnswer('${questionId}','${a.id}','${a.user_id}')">${t('markBest')}</button>` : ''}</div>`).join('') || `<div class="empty">${t('noAnswersYet')}</div>`;
}
async function postAnswer(){
  const content = document.getElementById('answerContent').value.trim();
  if(!content || !currentQuestionId) return;
  const { error } = await sb.from('qa_answers').insert({ question_id: currentQuestionId, user_id: currentUser.id, content });
  if(error){ alert('Error: '+error.message); return; }
  document.getElementById('answerContent').value = '';
  recordActivity(5);
  const { data: q } = await sb.from('qa_questions').select('user_id, resolved_answer_id').eq('id', currentQuestionId).single();
  loadAnswers(currentQuestionId, q.user_id, q.resolved_answer_id);
}
async function markBestAnswer(questionId, answerId, answererId){
  const { error } = await sb.from('qa_questions').update({ resolved_answer_id: answerId }).eq('id', questionId);
  if(error){ alert('Error: '+error.message); return; }
  await awardPointsTo(answererId, 15);
  const { data: q } = await sb.from('qa_questions').select('user_id, resolved_answer_id').eq('id', questionId).single();
  loadAnswers(questionId, q.user_id, q.resolved_answer_id);
}

/* -------------------- لوحة المتصدرين -------------------- */
async function loadLeaderboard(){
  const { data } = await sb.from('profiles').select('username, points, avatar_url').order('points', { ascending: false }).limit(10);
  document.getElementById('leaderboardList').innerHTML = (data||[]).map((u, i) => `<div class="leaderRow"><div style="display:flex;align-items:center;gap:10px"><span class="rank">#${i+1}</span><div class="avatar" style="width:28px;height:28px;font-size:12px">${avatarHtml(u)}</div><span>${escapeHtml(u.username)}</span></div><span style="color:var(--accent);font-weight:600">${u.points || 0} ${t('points')}</span></div>`).join('') || `<div class="empty">${t('noLeaderboardData')}</div>`;
}

/* -------------------- الشات المباشر -------------------- */
async function loadAllProfiles(){
  const { data } = await sb.from('profiles').select('*').neq('id', currentUser.id);
  allProfiles = (data||[]).filter(p => !blockedIds.includes(p.id));
  document.getElementById('chatUsersList').innerHTML = allProfiles.map(p => `<div class="u" id="chatUser-${p.id}" onclick="openChat('${p.id}','${p.username}')">${p.username}${p.exam_freeze_until ? ' 🎓' : ''}</div>`).join('') || `<div class="empty">${t('noOtherUsers')}</div>`;
}
async function openChat(userId, username){
  activeChatUser = { id: userId, username };
  document.querySelectorAll('.chatUsers .u').forEach(u=>u.classList.remove('active'));
  document.getElementById('chatUser-'+userId).classList.add('active');
  document.getElementById('chatInput').disabled = false;
  document.getElementById('chatSendBtn').disabled = false;
  await loadMessages();
  if(chatChannel) sb.removeChannel(chatChannel);
  chatChannel = sb.channel('chat-'+[currentUser.id, userId].sort().join('-')).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
    const m = payload.new;
    if(m.sender_id === currentUser.id) return;
    const involved = (m.sender_id===currentUser.id && m.receiver_id===userId) || (m.sender_id===userId && m.receiver_id===currentUser.id);
    if(involved) appendMessage(m);
  }).subscribe();
}
async function loadMessages(){
  const { data } = await sb.from('messages').select('*').or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${activeChatUser.id}),and(sender_id.eq.${activeChatUser.id},receiver_id.eq.${currentUser.id})`).order('created_at', { ascending: true });
  const box = document.getElementById('chatBox');
  box.innerHTML = '';
  (data||[]).forEach(m => appendMessage(m));
}
function appendMessage(m){
  const box = document.getElementById('chatBox');
  const mine = m.sender_id === currentUser.id;
  const div = document.createElement('div');
  div.className = 'msg ' + (mine ? 'mine' : 'theirs');
  div.textContent = m.content;
  div.dataset.msgId = m.id;
  const isTemp = String(m.id).startsWith('temp-');
  if(mine && !isTemp){
    const delBtn = document.createElement('span');
    delBtn.textContent = ' 🗑';
    delBtn.className = 'delMsgBtn';
    delBtn.onclick = () => deleteMessage(m.id, div);
    div.appendChild(delBtn);
  }
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
async function deleteMessage(msgId, element){
  if(!confirm(t('confirmDeleteMsg'))) return;
  const { error } = await sb.from('messages').delete().eq('id', msgId);
  if(error){ alert(t('couldNotDelete')+error.message); return; }
  element.remove();
}
async function sendMessage(e){
  e.preventDefault();
  if(!activeChatUser) return;
  const input = document.getElementById('chatInput');
  const content = input.value.trim();
  if(!content) return;

  const { data: target } = await sb.from('profiles').select('exam_freeze_until').eq('id', activeChatUser.id).single();
  if(target && target.exam_freeze_until){
    const today = new Date().toISOString().split('T')[0];
    if(target.exam_freeze_until > today){
      alert(t('userFrozenMsg'));
      return;
    }
  }

  input.value = '';
  const tempId = 'temp-'+Date.now();
  appendMessage({ id: tempId, sender_id: currentUser.id, content });

  const { data, error } = await sb.from('messages')
    .insert({ sender_id: currentUser.id, receiver_id: activeChatUser.id, content })
    .select()
    .single();

  if(error){
    alert(t('couldNotSend')+error.message);
    document.querySelector(`[data-msg-id="${tempId}"]`)?.remove();
    return;
  }

  const tempEl = document.querySelector(`[data-msg-id="${tempId}"]`);
  if(tempEl) tempEl.remove();
  appendMessage(data);
}

(async function init(){
  const { data: { session } } = await sb.auth.getSession();
  if(session) await afterLogin(session.user);
})();
