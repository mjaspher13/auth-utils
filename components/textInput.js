const renderInputComponent = ({
    isEditMode,
    isCurrency,
    textInputRef,
    a11yHeaderId,
    index,
    isFixed,
    value,
    handleCancel,
    editableCellRef,
    errorsCount,
    errorMessages,
    validationFunction,
    filteringFunction,
    minWidth,
    row,
  }) => {
    if (!isEditMode) return null;
  
    const commonProps = {
      textInputRef,
      a11yHeaderId,
      index,
      isFixed,
      value,
      errorsCount,
      errorMessages,
      validationFunction,
      handleCancel,
    };
  
    return isCurrency ? (
      <CurrencyInput {...commonProps} inputValue={value} cardRef={row?.original?.cardRef} />
    ) : (
      <TextInput {...commonProps} editableCellRef={editableCellRef} filteringFunction={filteringFunction} minWidth={minWidth} />
    );
  };
  