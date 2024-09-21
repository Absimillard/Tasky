
<Box> 
{project.submits &&
    project.submits.map((sub, index) => (
    <Box key={index}>
        <Typography>{sub.userID}</Typography>
        <img src={sub.submitImage} alt="submit" />
        <Typography>{sub.content}</Typography>
        <Box>
        <Typography>Callback</Typography>
        <Typography>{sub.callback[0]?.userID}</Typography>
        <Typography>{sub.callback[0]?.content}</Typography>
        </Box>
    </Box>
    ))}
</Box>