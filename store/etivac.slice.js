updateMyCard: (state, action) => {
    const { index, column, value } = action.payload;
    const existingEdit = state.editCards.find(editedRow => editedRow.index === index);

    if (existingEdit) {
        if (existingEdit[column] !== value) existingEdit[column] = value;
    } else {
        state.editCards.push({ index, [column]: value });
    }
}
